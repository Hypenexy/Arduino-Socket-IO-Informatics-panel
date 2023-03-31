#include <DHT.h>

#define DHTPIN 2     // DHT PIN
#define DHTTYPE DHT22   // DHT 22  (AM2302)
DHT dht(DHTPIN, DHTTYPE); //// Initialize DHT sensor for normal 16mhz Arduino

//Variables
int chk;
float hum;  //Влажност
float temp; //Температура


int water; //вода
int soil = A2;//почва
void setup() {
  Serial.begin(128000);
  dht.begin();
  pinMode(3, OUTPUT);
  digitalWrite(3, LOW);
  //pinMode(3,OUTPUT); //изходящ пин за релето, който изпраща сигнал на релето//output pin for relay board, this will sent signal to the relay
 
  pinMode(6,INPUT); //вход. пин идващ от сензора за почва//input pin coming from soil sensor
  delay(1000);
}

void loop() {
  digitalWrite(3, HIGH);
  delay(1000);
  int soilRead = analogRead(2);
  //digitalWrite(3, LOW);
  //water = digitalRead(6);  // туй чете входящия сигнал от сензора за почва//reading the coming signal from the soil sensor
  // Serial.print("Проводимост:");
  // Serial.print(water);
  // Serial.print(" ,Влажност-на-почвата:");
  // Serial.println(soilRead);
 
  //Чете данните и запазва стойностите за влажност и температура
    // hum = dht.readHumidity();
    temp= dht.readTemperature();
    //Принтиране
    // Serial.print("Влажност-на-въздуха:");
    // Serial.print(hum);
    Serial.print("{\"Temp\":");
    Serial.print(temp);
    Serial.println("}");
    // Serial.println(" Целзий");
    delay(1000); //Delay 2 sec.
  /*if(water == HIGH) //ако влажността е висока, прекъсни релето// if water level is full then cut the relay
  {
  digitalWrite(3,LOW); // прекъсване на сигнала  на релето//low is to cut the relay
  }
  else
  {
  digitalWrite(3,HIGH); //продължаване на сигнала на релето и работата на водната помпа//high to continue proving signal and water supply
  }*/
  delay(1000);
}
