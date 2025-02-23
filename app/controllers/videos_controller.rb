class VideosController < ApplicationController
  before_action :set_video, only: [:show, :edit, :update, :destroy]

  def index
    @videos = Video.includes(video_file_attachment: :blob)
    .ordered

    # Filter by category if provided
    @videos = @videos.by_category(params[:category]) if params[:category].present?

    # Search if query provided
    @videos = @videos.search_by_title_and_description(params[:query]) if params[:query].present?
  end

  def show
  end

  def new
    @video = Video.new
  end

  def create
    @video = Video.new(video_params)
    if @video.save
      redirect_to videos_path, notice: 'Video was successfully uploaded.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @video.update(video_params)
      redirect_to @video, notice: 'Video was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @video.destroy
    redirect_to videos_url, notice: 'Video was successfully removed.'
  end

  private

  def set_video
    @video = Video.friendly.find(params[:id])
  end

  def video_params
    params.require(:video).permit(:title, :description, :category, :video_file, :position)
  end
end
