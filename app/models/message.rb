class Message < ApplicationRecord
  validates :content, presence: true, unless: 'image.present?'
  belongs_to :group
  belongs_to :user
  mount_uploader :image, ImageUploader
end
