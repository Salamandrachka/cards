import { Card } from "./Cards.js";

export class Request {
  constructor(url) {
    this.url = url;
    this.noCards = document.getElementById("no-cards-message");
  }

  async autorization(formData) {
    const response = await fetch(`${this.url}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.status !== 200) {
      alert("Incorrect username or password");
    } else {
      const token = await response.text();
      localStorage.setItem("token", token);
      console.log(token);
      return token;
    }
  }

  async postCard(formData) {
    const response = await fetch(`${this.url}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });
    let responseJson = await response.json();

    // If "No cards" message is currently displayed, hide it
    if (!this.noCards.classList.contains("hidden")) {
      this.noCards.classList.add("hidden");
    }
    return responseJson;
  }
  async getALLCards() {
    const response = await fetch(`${this.url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    let responseJson = await response.json();
    if (responseJson.length === 0) {
      this.noCards.classList.remove("hidden");
    } else {
      this.noCards.classList.add("hidden");
    }
    responseJson.forEach((dataCard) => {
      let card = new Card(dataCard);
      card.createCard();
      //while reload class with priority is adding fro the server request
      card.card.classList.add(`${dataCard.priorityEdit}`);
      //delete class undefined which was added in createCard() in class Card
      card.card.classList.remove("undefined");
    });
    return responseJson;
  }
  async deleteCard(id) {
    const response = await fetch(`${this.url}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const cards = await this.getALLCards();
    if (cards.length === 0) {
      this.noCards.classList.remove("hidden");
    }
    return response;
  }

  async editCard(id, formData) {
    const response = await fetch(`${this.url}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    let responseJson = await response.json();
    return responseJson;
  }
}
