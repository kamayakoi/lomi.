### Overview

Collection microservice has functionalities that will allow Ecobank to accept payments from your customers through the means of your choosing. eg.(Portal integration, Mobile App, POS, Web App etc.)
On our sandbox you are able to very quickly generate a REST API on top of our collections microservice, therefore allowing you to explore it within Postman or Bruno.

## Setup

Ensure you have the acquired the appropriate credential to make requests to Unified Developer LAB API.
To generate a secure Hash for your request payload a lab_key is required.
lab_key sample: "XT7zuounWNKXmbwdAR+qYhyQymRdsEUylXFZ/frwBBjDKZsPCDlUjAMH4OQT+uvU"

## Requirement to successfully generate a secure hash:

lab_key is the key shared after onboarding

payload is the concatenation of field values in your JSON request from top down as a single string.
  PS: For the Payment section the payload should only be made up of field values in the header section of your JSON request.
SHAR-512 is your algorithm for one-way hashing

Hashing can be done with any language of preference, below is a sample JAVA code for hashing:


Plain Text
    private static final String LAB_KEY ="XT7zuounWNKXmbwdAR+qYhyQymRdsEUylXFZ/frwBBjDKZsPCDlUjAMH4OQT+uvU";
    public static String Hash512Msg(String payload) {
      String result;
        try {
            String data = payload + lab_key;
            MessageDigest digest = MessageDigest.getInstance("SHA-512");
            // ** NOTE all bytes that are retrieved from the data string must be done so using UTF-8 Character Set.
            byte[] hashBytes = (data).getBytes("UTF-8");
            //Create the hash bytes from the data
            byte[] messageDigest = digest.digest(hashBytes);
            //Create a HEX string from the hashed data
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < messageDigest.length; i++) {
                String h = Integer.toHexString(0xFF & messageDigest[i]);
                while (h.length() < 2) {
                    h = "0" + h;
                }
                sb.append(h);
            }
            result = sb.toString();
        } catch (Exception ex) {
            //Log your errors;
        }
        //sample result :2611e1ad3a8077020c55a227408329f0b2bb4f00c0e409a93abd69dba133c5d5a7d7575fef87cb13a9d5319c2f78199d8e674ce6f7d63acea95ae5a214ad9f5a
        return result;
    }

Fire up request payload with secure hash value for integrity check:

HTML. FORM URL
https://developer.ecobank.com/CBSWebSandbox/
Ensure your user has the correct permissions to access the collection service requested.
Now you're ready to run this collection in Postman!
