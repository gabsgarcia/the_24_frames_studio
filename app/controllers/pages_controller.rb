class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :home ]

  def home
    @videos = Video.ordered.with_attached_video_file
  end
end
