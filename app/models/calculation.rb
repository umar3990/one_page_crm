class Calculation < ApplicationRecord
  validates :a, :b, :operator, :result, presence: true
  validates :a, :b, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than: 100 }
  validates :a, :b, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than: 100 }
  validates :result, numericality: { only_integer: true }
  validates :operator, inclusion: { in: %w[sum difference multiplication division] }

  before_save :increment_query_count

  private

  def increment_query_count
    return self.query_count = 1 if self.new_record?
    self.query_count += 1
  end
end
