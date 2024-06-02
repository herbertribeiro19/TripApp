import { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Alert, Keyboard, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import Slider from '@react-native-community/slider';

const statusBarHeight = StatusBar.currentHeight;

export default function App() {
  // API_URL = https://api.openai.com/v1/chat/completions

  const [days, setDays] = useState(3);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [travel, setTravel] = useState("");

  const chatApiKey = 'sk-proj-TjA6pX9mFS1FG6xk1L1LT3BlbkFJZkGkh1oCYPzpjebX7mas';

  async function buttonPress() {
    if (city === "") {
      Alert.alert("Erro", "Por favor, informe uma cidade");
      return;
    }
    setTravel("");
    setLoading(true);
    Keyboard.dismiss;

    const PROMPT = `Crie um roteiro para uma viagem de exatos ${days.toFixed(0)} dias em ${city} , busque por lugares turisticos, lugares mais visitados, seja preciso nos dias de estadia fornecidos e limite o roteiro apenas na cidade fornecida. Forneça apenas em tópicos com nome do local onde ir em cada dia e de forma sucinta.`;

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-0613",
        messages: [
          {
            role: 'user',
            content: PROMPT,
          }
        ],
        temperature: 0.20,
        max_tokens: 500,
        top_p: 1,
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        console.log(data.choices[0].message.content);
        setTravel(data.choices[0].message.content);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <View >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#1D1D1F", "#101D22", "#0A2C39"]}
        style={styles.container}
      >

        <Text style={styles.header}>TripEasy</Text>

        <LinearGradient
          colors={["#0A2C39", "#0E181D"]}
          style={styles.boxContainer}
          start={[0, 0.7]}
          end={[0.7, 0]}>

          <Text style={styles.cityText}>Cidade destino</Text>
          <TextInput
            style={styles.inputText}
            placeholder="Ex: São Paulo"
            placeholderTextColor={"#B2B3BD"}
            value={city}
            onChangeText={(text) => setCity(text)}
          />

          <Text style={styles.diasText}>Tempo de estadia: {days.toFixed(0)} dias</Text>
          <Slider
            minimumValue={0}
            maximumValue={7}
            minimumTrackTintColor='#0D546D'
            maximumTrackTintColor='#5F606A'
            thumbTintColor='#1B7FA1'
            value={days}
            onValueChange={(value) => setDays(value)}
          />
        </LinearGradient>

        <TouchableOpacity onPress={buttonPress}>
          <LinearGradient
            colors={["#313237", "#797B86"]}
            style={styles.btn}
            start={[0, 1]}
            end={[1, 0]}>
            <Text style={styles.btnText}>Gerar Roteiro</Text>
          </LinearGradient>
        </TouchableOpacity>



        {loading && (
          <LinearGradient
            colors={["#0A2C39", "#0E181D"]}
            style={styles.boxContainerResult}
          >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

              <View>
                <Text style={styles.titleResultText}>Carregando o roteiro..</Text>

                <ActivityIndicator color="##EEEEF0" size="large" />
              </View>



            </ScrollView>
          </LinearGradient>
        )}

        {travel && (
          <LinearGradient
            colors={["#0A2C39", "#0E181D"]}
            style={styles.boxContainerResult}
          >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

              <View>
                <Text style={styles.titleResultText}>Roteiro da sua viagem</Text>

                <Text style={styles.contentText}>
                  {travel}
                </Text>
              </View>



            </ScrollView>
          </LinearGradient>
        )}





      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: 'center',
  },

  header: {
    color: "#EEEEF0",
    fontWeight: "bold",
    fontSize: 30,
    marginTop: Platform.OS === "android" ? statusBarHeight : 64,
  },

  boxContainer: {
    width: "86%",
    height: "26%",
    borderRadius: 20,
    marginTop: 30,
    padding: 20,
  },

  cityText: {
    color: "#EEEEF0",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: "4%",
  },

  inputText: {
    padding: 16,
    borderColor: "#B2B3BD",
    borderWidth: 0.5,
    borderRadius: 10,
    color: "#EEEEF0",
  },

  diasText: {
    color: "#EEEEF0",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: "6%",
    marginBottom: "2%",
  },

  btn: {
    width: "40%",
    marginTop: 10,
    padding: 12,
    backgroundColor: "#0E181D",
    borderRadius: 12,
    alignItems: "center",
  },

  btnText: {
    color: "#EEEEF0",
    fontWeight: "600",
    fontSize: 18,
  },

  boxContainerResult: {
    width: "86%",
    height: "auto",
    borderRadius: 16,
    marginTop: 20,
    padding: 20,
    marginBottom: 20,
  },

  titleResultText: {
    color: "#EEEEF0",
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: "6%",
    alignSelf: "center",
  },

  contentText: {
    color: "#EEEEF0",
    fontWeight: "regular",
    fontSize: 16,
    marginBottom: "2%",
    textAlign: "justify",
    width: "98%",
    alignSelf: "center",
  }

});
