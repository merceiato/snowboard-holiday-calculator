document.addEventListener("DOMContentLoaded", () => {
    let startDate = null;
    let endDate = null;

    // Initialize Flatpickr for the date range
    flatpickr("#dateRange", {
        mode: "range",
        inline: true,
        dateFormat: "Y-m-d",
        onChange: function (selectedDates) {
            if (selectedDates.length === 2) {
                startDate = selectedDates[0];
                endDate = selectedDates[1];
            }
        },
    });

    // Show/hide custom input fields based on dropdown selection
    const locationDropdown = document.getElementById("location");
    const customLocationFields = document.getElementById("customLocationFields");
    const budgetTierDropdown = document.getElementById("budgetTier");
    const equipmentDropdown = document.getElementById("equipment");
    const customEquipmentField = document.getElementById("customEquipmentField");

    locationDropdown.addEventListener("change", () => {
        if (locationDropdown.value === "custom") {
            customLocationFields.classList.remove("hidden");
        } else {
            customLocationFields.classList.add("hidden");
        }
    });

    budgetTierDropdown.addEventListener("change", () => {
        if (budgetTierDropdown.value === "custom") {
            alert("Custom budget tiers are currently not supported.");
        }
    });

    equipmentDropdown.addEventListener("change", () => {
        if (equipmentDropdown.value === "custom") {
            customEquipmentField.classList.remove("hidden");
        } else {
            customEquipmentField.classList.add("hidden");
        }
    });

    // Info dialogue logic
    const infoButton = document.getElementById("infoButton");
    const dialogue = document.getElementById("dialogue");
    const closeDialogue = document.getElementById("closeDialogue");

    infoButton.addEventListener("click", () => {
        document.body.classList.add("dialogue-open");
        dialogue.classList.remove("hidden");
    });

    closeDialogue.addEventListener("click", () => {
        document.body.classList.remove("dialogue-open");
        dialogue.classList.add("hidden");
    });

    // Calculate button logic
    document.getElementById("calculate").addEventListener("click", function () {
        const resultsDiv = document.getElementById("results");
        const placeholder = document.getElementById("placeholder");
        const userBudget = parseFloat(document.getElementById("userBudget").value);

        // Remove the placeholder if it exists
        if (placeholder) {
            placeholder.remove();
        }

        if (!startDate || !endDate) {
            alert("Please select a valid date range.");
            return;
        }

        if (isNaN(userBudget) || userBudget <= 0) {
            alert("Please enter a valid budget.");
            return;
        }

        const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
        if (days <= 0) {
            alert("End date must be after the start date.");
            return;
        }

        const skiDays = Math.max(days - 2, 0);

        const location = locationDropdown.value;
        const budgetTier = budgetTierDropdown.value;
        const equipment = equipmentDropdown.value;

        const costs = {
            location: {
                local: { accommodation: 150, travel: 250, liftTicket: 200 },
                interstate: { accommodation: 150, travel: 700, liftTicket: 200 },
                japan: { accommodation: 150, travel: 1500 + 300, liftTicket: 80 },
                canada: { accommodation: 150, travel: 3500 + 500, liftTicket: 100 },
            },
            equipment: { hire: { perDay: 80, flatFee: 0 }, gearTransport: { perDay: 0, flatFee: 200 }, na: { perDay: 0, flatFee: 0 } },
            budgetMultiplier: { low: 0, mid: 0.2, high: 0.5 },
        };

        // Custom costs
        let accommodationCost = 0;
        let travelCost = 0;
        let liftTicketCost = 0;
        let equipmentCost = 0;

        if (location === "custom") {
            accommodationCost = parseFloat(document.getElementById("customAccommodation").value) || 0;
            travelCost = parseFloat(document.getElementById("customTravel").value) || 0;
        } else {
            const locationCosts = costs.location[location];
            accommodationCost = days * locationCosts.accommodation;
            travelCost = locationCosts.travel;
            liftTicketCost = skiDays * locationCosts.liftTicket;
        }

        if (equipment === "custom") {
            equipmentCost = parseFloat(document.getElementById("customEquipment").value) || 0;
        } else {
            const equipmentCosts = costs.equipment[equipment];
            equipmentCost = days * equipmentCosts.perDay + equipmentCosts.flatFee;
        }

        const budgetMultiplier = costs.budgetMultiplier[budgetTier];
        const baseExpenses = accommodationCost + travelCost + equipmentCost + liftTicketCost;
        const budgetAdjustment = baseExpenses * budgetMultiplier;
        const gst = (baseExpenses + budgetAdjustment) * 0.1;
        const totalExpenses = baseExpenses + budgetAdjustment + gst;

        // Compare the total cost with the user's budget
        const budgetComparison = userBudget - totalExpenses;

        // Display results
        resultsDiv.innerHTML = `
            <h2>Results</h2>
            <p>Accommodation: $${accommodationCost.toFixed(2)}</p>
            <p>Travel: $${travelCost.toFixed(2)}</p>
            <p>Equipment: $${equipmentCost.toFixed(2)}</p>
            <p>Lift Tickets: $${liftTicketCost.toFixed(2)}</p>
            <p>Budget Adjustment: $${budgetAdjustment.toFixed(2)}</p>
            <p>GST (10%): $${gst.toFixed(2)}</p>
            <h3>Total Cost: $${totalExpenses.toFixed(2)}</h3>
            <p>Your Budget: $${userBudget.toFixed(2)}</p>
            <p>Difference: ${budgetComparison >= 0 ? "You are under budget by" : "You are over budget by"} $${Math.abs(budgetComparison).toFixed(2)}</p>
            <img src="./images/${budgetComparison >= 0 ? "happy_face.png" : "sad_face.png"}" alt="${
            budgetComparison >= 0 ? "Happy Face" : "Sad Face"
        }" style="width: 100px; margin-top: 20px;">
        `;
    });
});
