const API_KEY = "AIzaSyD9NPAIPdTT9ZndwagGQAbvOZf6lsaxvTA";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

document.getElementById("travelForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const destination = document.getElementById("destination").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  // Show loading spinner
  document.getElementById("travel-loading").classList.remove("hidden");
  document.getElementById("travel-results").classList.add("hidden");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Create a brief travel itinerary for ${destination} from ${startDate} to ${endDate}. 
              Requirements:
              - Maximum 3 activities per day
              - Each activity description should be 3-4 words maximum
              - Format as simple text with each line as: Day number | Time | Activity
              - Times should be in format like "9 AM" or "2 PM"
              - Do not include any special characters or formatting
              Example format:
              Day 1 | 9 AM | Visit Central Park
              Day 1 | 2 PM | Shopping at Mall
              Day 2 | 10 AM | Beach Swimming`,
            },
          ],
        },
      ],
    }),
  });

  document.getElementById("travel-loading").classList.add("hidden");

  if (!response.ok) {
    throw new Error("Failed to give response");
  }

  const itineraryBody = document.getElementById("itineraryBody");

  itineraryBody.innerHTML = "";

  const data = await response.json();
  console.log(data);

  const content = data.candidates[0].content.parts[0].text;
  // console.log(content);

  const lines = content.split("\n").filter((value) => value.trim());
  console.log(lines);

  lines.forEach((line) => {
    if (line.trim()) {
      const [day, time, activity] = line.split("|").map((item) => item.trim());

      if (day && time && activity) {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${day}</td>          
        <td>${time}</td>       
        <td>${activity}</td>`;
        document.getElementById("itineraryBody").appendChild(row);
      }
    }
  });
  document.getElementById("travel-results").classList.remove("hidden");
});

/////// food suggestions

document.getElementById("foodForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fromEl = document.getElementById("from").value;
  const toEl = document.getElementById("to").value;
  const foodEl = document.getElementById("food-type").value;
  const cuisineEl = document.getElementById("cuisine").value;
  // console.log(cuisineEl, foodEl, toEl, fromEl);

  document.getElementById("food-loading").classList.remove("hidden");
  document.getElementById("food-results").classList.add("hidden");

  const response2 = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Create a brief food suggestion planner from ${fromEl} to ${toEl} that should be ${foodEl} and cuisine should be ${cuisineEl}.
            Requirements:
            - Breakfast lunch dinner should be there
            - Each one should be 3-4 words maximum
            - Format as simple text with each line as: Day | Breakfast | Lunch | Dinner
            - Do not include any special characters or formatting
            Example format:
            Monday | Dosa and chutney | Biriyani | Rice and curry
            Tuesday | Burger | Sandwich | Pizza
            Wednesday | Fried rice | Momo's | Kung Pao Chicken
           `,
            },
          ],
        },
      ],
    }),
  });

  document.getElementById("food-loading").classList.add("hidden");

  if (!response2.ok) {
    throw new Error("Failed to give response");
  }

  const suggestionBody = document.getElementById("suggestionBody");

  suggestionBody.innerHTML = "";

  const data2 = await response2.json();
  console.log(data2);

  const content = data2.candidates[0].content.parts[0].text;
  // console.log(content);

  const suggestions = content.split("\n").filter((value) => value.trim());
  console.log(suggestions);

  suggestions.forEach((suggestion) => {
    if (suggestion.trim()) {
      const [day, breakfast, lunch, dinner] = suggestion
        .split("|")
        .map((item) => item.trim());

      if (day && breakfast && lunch && dinner) {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${day}</td>          
        <td>${breakfast}</td>       
        <td>${lunch}</td>
        <td>${dinner}</td>`;
        document.getElementById("suggestionBody").appendChild(row);
      }
    }
  });
  document.getElementById("food-results").classList.remove("hidden");
});

// DARK MODE TOGGLE
const toggleInput = document.getElementById("darkToggle");
toggleInput.checked = false;

toggleInput.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", toggleInput.checked);
  if (toggleInput.checked) {
    let darks = (document.querySelector(".mode-label").textContent =
      "Light Mode");
    localStorage.setItem("dark", darks);
  } else {
    document.querySelector(".mode-label").textContent = "Dark Mode";
  }
  localStorage.getItem("dark");
});

//////////////////
