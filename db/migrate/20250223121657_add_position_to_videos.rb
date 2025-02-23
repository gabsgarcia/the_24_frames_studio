class AddPositionToVideos < ActiveRecord::Migration[7.1]
  def change
    add_column :videos, :position, :integer
    add_index :videos, :position
  end
end
