# app/models/video.rb
class Video < ApplicationRecord
  include PgSearch::Model

  has_one_attached :video_file
  has_one_attached :thumbnail

  # Add position for manual ordering
  acts_as_list

  # Add friendly URLs
  extend FriendlyId
  friendly_id :title, use: :slugged

  # Search scope
  pg_search_scope :search_by_title_and_description,
    against: [:title, :description],
    using: {
      tsearch: { prefix: true }
    }

  # Keep your existing code
  VALID_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo']
  MAX_VIDEO_SIZE = 500.megabytes

  enum :category, {
    commercial: 0,
    corporate: 1,
    wedding: 2,
    event: 3,
    other: 4
  }, default: :other

  validates :title, presence: true
  validates :description, presence: true
  validates :category, presence: true
  validates :video_file, presence: true

  validate :acceptable_video

  scope :ordered, -> { order(position: :asc) }
  scope :by_category, ->(category) { where(category: category) if category.present? }

  def category_name
    category&.titleize
  end

  def video_url
    if video_file.attached?
      Rails.application.routes.url_helpers.url_for(video_file)
    end
  end

  private

  def acceptable_video
    return unless video_file.attached?

    unless video_file.blob.byte_size <= MAX_VIDEO_SIZE
      errors.add(:video_file, "is too large (maximum is #{MAX_VIDEO_SIZE/1.megabyte}MB)")
    end

    unless VALID_VIDEO_TYPES.include?(video_file.content_type)
      errors.add(:video_file, "must be a video file (MP4, MOV, or AVI)")
    end
  end
end
