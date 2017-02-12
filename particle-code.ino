// This #include statement was automatically added by the Particle IDE.
#include <IRremote.h>

// Samsung AA59 - 00507A
const uint32_t POWER   = 0xF4BA2988;
const uint32_t HMDI    = 0xC1302667;
const uint32_t VOLUP   = 0x68733A46;
const uint32_t VOLDOWN = 0x83B19366;
const uint32_t MUTE    = 0x2340B922;

/* Connect the output of the IR receiver diode to pin 11. */
int RECV_PIN = D0;

/* Initialize the irrecv part of the IRremote  library */
IRrecv irrecv(RECV_PIN);
decode_results results; // This will store our IR received codes
uint32_t lastCode = 0; // This keeps track of the last code RX'd

void setup() {

    Serial.begin(9600); // Use serial to debug. 
    irrecv.enableIRIn(); // Start the receiver

}

void loop() {
    

if (irrecv.decode(&results)) 
  {
    Serial.println(results.decode_type);  
     
    /* read the RX'd IR into a 16-bit variable: */
    uint32_t resultCode = (results.value & 0xFFFFFFFF);   // uint32t & 0xFFFFFFFF ????????????????

    /* The remote will continue to spit out 0xFFFFFFFF if a 
     button is held down. If we get 0xFFFFFFF, let's just
     assume the previously pressed button is being held down */
    if (resultCode == 0xFFFFFFFF)
      resultCode = lastCode;
    else
      lastCode = resultCode;

    // This switch statement checks the received IR code against
    // all of the known codes. Each button press produces a 
    // serial output, and has an effect on the LED output.
    switch (resultCode)
    {
      case POWER:
        Serial.println("Power");
        break;
      case HMDI:
        Serial.println("HDMI");
        break;
      case VOLUP:
        Serial.println("Lauter");
        break;
      case VOLDOWN:
        Serial.println("Leiser");
        break;
      case MUTE:
        Serial.println("Mute");
        break;
      default:
        Serial.print("Unrecognized code received: 0x");
        Serial.println(results.value, HEX);
        break;        
    }    
    irrecv.resume(); // Receive the next value
  }    
}