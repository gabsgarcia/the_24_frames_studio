# app/models/video.rb
class Video < ApplicationRecord
  include PgSearch::Model
  attr_accessor :cloudinary_id

  after_create_commit :generate_thumbnail, if: -> { video_file.attached? }

  before_save :attach_cloudinary_video, if: -> { cloudinary_id.present? }

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
      if Rails.env.production? && video_file.service_name == "cloudinary"
        # For Cloudinary-stored videos in production
        public_id = video_file.key
        Cloudinary::Utils.cloudinary_url(public_id, resource_type: 'video')
      else
        # For local storage or other services
        Rails.application.routes.url_helpers.rails_blob_url(video_file, only_path: false)
      end
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

  def attach_cloudinary_video
    # This connects the Cloudinary resource to Active Storage
    begin
      video_url = "https://res.cloudinary.com/#{ENV['CLOUDINARY_CLOUD_NAME']}/video/upload/#{cloudinary_id}"
      
      uri = URI.parse(video_url)
      filename = File.basename(uri.path)
      
      self.video_file.attach(
        io: URI.open(video_url),
        filename: filename,
        content_type: "video/mp4" # Adjust based on format
      )
    rescue URI::InvalidURIError => e
      errors.add(:cloudinary_id, "contains invalid characters: #{e.message}")
      Rails.logger.error("Invalid Cloudinary URL: #{e.message}")
      return false
    rescue OpenURI::HTTPError => e
      errors.add(:cloudinary_id, "could not be found on Cloudinary (#{e.message})")
      Rails.logger.error("Cloudinary resource not found: #{e.message}")
      return false
    rescue StandardError => e
      errors.add(:base, "Error attaching video from Cloudinary: #{e.message}")
      Rails.logger.error("Error attaching Cloudinary video: #{e.message}")
      return false
    end
  end
  
  def generate_thumbnail
    return unless video_file.attached?
    
    if video_file.service_name == "cloudinary"
      # Cloudinary thumbnail generation (your existing code)
      # Get the Cloudinary public ID from the key
      public_id = video_file.key
      
      # Generate a thumbnail URL using Cloudinary transformations
      thumbnail_url = Cloudinary::Utils.cloudinary_url(
        public_id, 
        resource_type: 'video',
        transformation: [
          { width: 480, crop: 'scale' },
          { start_offset: '1' }
        ],
        format: 'jpg'
      )
      
      # Attach the thumbnail
      self.thumbnail.attach(
        io: URI.open(thumbnail_url),
        filename: "#{title.parameterize}-thumbnail.jpg",
        content_type: "image/jpeg"
      )
    else
      # Local storage thumbnail generation using FFmpeg
      # This requires FFmpeg to be installed on your system
      begin
        # Create a temporary file to store the thumbnail
        tempfile = Tempfile.new([title.parameterize, '.jpg'], binmode: true)
        
        # Get the path to the video file
        video_path = ActiveStorage::Blob.service.path_for(video_file.key)
        
        # Extract thumbnail using FFmpeg
        system("ffmpeg -y -i #{video_path} -ss 00:00:01 -vframes 1 #{tempfile.path}")
        
        # Attach the thumbnail
        self.thumbnail.attach(
          io: File.open(tempfile.path),
          filename: "#{title.parameterize}-thumbnail.jpg",
          content_type: "image/jpeg"
        )
      rescue => e
        Rails.logger.error("Error generating thumbnail locally: #{e.message}")
      ensure
        tempfile.close! if tempfile
      end
    end
  end
end
