class Message < ApplicationRecord
  validates :content, presence: true
  belongs_to :group
  belongs_to :user
  mount_uploader :image, ImageUploader
end
