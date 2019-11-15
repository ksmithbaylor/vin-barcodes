require 'vinbot'

def add_vin
  print '"' + Vinbot::Vin.generate + '"'
end

puts '['

9999.times do
  add_vin
  print ','
end

add_vin

puts ']'
