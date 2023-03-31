#include <DHT.h>

#define DHTPIN 2  // DHT PIN
#define DHTTYPE DHT22 // DHT 22 (AM2302)
DHT dht(DHTPIN, DHTTYPE); // Initialize DHT sensor for normal 16mhz Arduino

// Variables
int chk; // Idk what chk is for (probably nothing)
float hum;  // Humidity
float temp; // Temperature
int water; // Water
int soil = A2; // Soil
void setup() {
  Serial.begin(128000);
  dht.begin();
  pinMode(3, OUTPUT); // Output pin for relay board, this will sent signal to the relay
  digitalWrite(3, LOW);
 
  pinMode(6,INPUT); // Input pin coming from soil sensor
}

void loop() {
  // Reading the coming signal from the soil sensor
  digitalWrite(3, HIGH);
  int soilRead = analogRead(2);
  digitalWrite(3, LOW);
  water = digitalRead(6);

  // Reads data from the dht sensor
  hum = dht.readHumidity();
  temp= dht.readTemperature();

  // Printing a JSON with the data values
  Serial.print("{");
  Serial.print("\"hum\":");
  Serial.print(hum);
  Serial.print(',');
  Serial.print("\"temp\":");
  Serial.print(temp);
  Serial.print(',');
  Serial.print("\"soil\":");
  Serial.print(soilRead);
  Serial.print(',');
  Serial.print("\"water\":");
  Serial.print(water);
  Serial.println("}"); // New line to separate data
  delay(1000);
}
