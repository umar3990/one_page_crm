class CalculatorController < ApplicationController
  before_action :set_operation, only: [:calculation]
  before_action :validate, only: [:calculation]
  def index; end

  def calculation
    respond_to do |format|
      format.js {
        calculation = Calculation.find_or_initialize_by(calculator_params)
        if calculation.new_record?
          result = perform_calculation
          return render json: { error: result }, status: :unprocessable_entity if result.is_a?(String)
          calculation.result = result
        end
        return render json: calculation, status: :ok if calculation.save
        render json: { error: "Calculation can't save due to #{calculation.errors.full_messages.join(', ')}" }, status: :unprocessable_entity
      }
    end
  end

  private

  def calculator_params
    params.require(:calculator).permit(:a, :b, :operator)
  end

  def set_operation
    @operator = calculator_params[:operator]
    @a = calculator_params[:a].to_i
    @b = calculator_params[:b].to_i
  end

  def validate
    unless valid_input?
      render json: { error: "Invalid value of a or b!" }, status: :unprocessable_entity
    end
  end

  def valid_input?
    calculator_params[:a].present? && calculator_params[:b].present? && (0..99).include?(@a) && (0..99).include?(@b)
  end

  def perform_calculation
    case @operator
    when 'sum'
      @a + @b
    when 'difference'
      @a - @b
    when 'multiplication'
      @a * @b
    when 'division'
      begin
        @a / @b
      rescue ZeroDivisionError => e
        return "#{e.message}"
      end
    end
  end
end
