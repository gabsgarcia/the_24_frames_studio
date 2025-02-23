class AddCategoryToVideos < ActiveRecord::Migration[7.1]
  def change
    remove_column :videos, :category
    add_column :videos, :category, :integer, default: 0, null: false
    add_index :videos, :category
  end
end
