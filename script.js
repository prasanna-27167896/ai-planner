const API_KEY =
  "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";

document.getElementById("travelForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const destination = document.getElementById("destination").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  // Show loading spinner
  document.getElementById("travel-loading").classList.remove("hidden");
  document.getElementById("travel-results").classList.add("hidden");

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-zero:free",
          messages: [
            {
              role: "user",
              content: `Create a brief travel itinerary for ${destination} from ${startDate} to ${endDate}. 
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
        }),
      }
    );

    const data = await response.json();

    // Hide loading spinner
    document.getElementById("travel-loading").classList.add("hidden");

    // Process and display results
    const itineraryBody = document.getElementById("itineraryBody");
    const content = data.choices[0].message.content;
    console.log(content);

    // Clear previous content
    itineraryBody.innerHTML = "";

    // Split content into lines and filter out unwanted lines
    const lines = content
      .split("\n")
      .filter(
        (line) =>
          line.trim() &&
          !line.includes("\\boxed") &&
          !line.includes("undefined") &&
          !line.includes("{") &&
          !line.includes("}")
      );

    // Create table rows
    lines.forEach((line) => {
      if (line.trim()) {
        const [day, time, activity] = line
          .split("|")
          .map((item) => item.trim());
        // Only create row if all values are present and valid
        if (day && time && activity) {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${day}</td>
            <td>${time}</td>
            <td>${activity}</td>
          `;
          itineraryBody.appendChild(row);
        }
      }
    });

    document.getElementById("travel-results").classList.remove("hidden");
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("travel-loading").classList.add("hidden");
    alert(
      "An error occurred while generating your itinerary. Please try again."
    );
  }
});

///////// food suggestions

document.getElementById("foodForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fromEl = document.getElementById("from").value;
  const toEl = document.getElementById("to").value;
  const foodEl = document.getElementById("food-type").value;
  const cuisineEl = document.getElementById("cuisine").value;
  // console.log(cuisineEl, foodEl, toEl, fromEl);

  document.getElementById("food-loading").classList.remove("hidden");
  document.getElementById("food-results").classList.add("hidden");

  try {
    const response2 = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-zero:free",
          messages: [
            {
              role: "user",
              content: `Create a brief food suggestion planner from ${fromEl} to ${toEl} that should be ${foodEl} and cuisine should be ${cuisineEl}. 
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
        }),
      }
    );
    const data2 = await response2.json();
    console.log(data2);

    document.getElementById("food-loading").classList.add("hidden");

    const suggestionBody = document.getElementById("suggestionBody");

    suggestionBody.innerHTML = "";

    const content2 = data2.choices[0].message.content;

    const suggestions = content2
      .split("\n")
      .filter(
        (suggestion) =>
          suggestion.trim() &&
          !suggestion.includes("{") &&
          !suggestion.includes("}") &&
          !suggestion.includes("\\boxed") &&
          !suggestion.includes("undefined")
      );

    suggestions.forEach((suggestion) => {
      if (suggestion.trim()) {
        const [day, breakfast, lunch, dinner] = suggestion
          .split("|")
          .map((item) => item.trim());

        if (day && breakfast && lunch && dinner) {
          let row = document.createElement("tr");
          row.innerHTML = `
          <td>${day}</td>
          <td>${breakfast}</td>
          <td>${lunch}</td>
          <td>${dinner}</td>
        `;
          suggestionBody.appendChild(row);
        }
      }
    });
    document.getElementById("food-results").classList.remove("hidden");
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("food-loading").classList.add("hidden");
    alert("Something went wrong generating food suggestions. Try again.");
  }
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
