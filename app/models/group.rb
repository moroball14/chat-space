class Group < ApplicationRecord
  has_many :users, through: :users_groups
  has_many :users_groups
  validates :name, presence: true, uniqueness: true
end
