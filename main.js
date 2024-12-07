document.addEventListener("DOMContentLoaded", () => {
    let startDate = null;
    let endDate = null;

    // Initialize Flatpickr
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

    // Function to toggle custom fields
    const toggleCustomFields = (dropdown, customFieldsContainer) => {
        dropdown.addEventListener("change", () => {
            if (dropdown.value === "custom") {
                customFieldsContainer.classList.remove("hidden");
            } else {
                customFieldsContainer.classList.add("hidden");
            }
        });
    };

    // Apply toggle logic to dropdowns
    toggleCustomFields(document.getElementById("location"), document.getElementById("customLocationFields"));
    toggleCustomFields(document.getElementById("budgetTier"), document.getElementById("customBudgetTierFields"));
    toggleCustomFields(document.getElementById("equipment"), document.getElementById("customEquipmentField"));

    // Calculate button logic
    document.getElementById("calculate").addEventListener("click", () => {
        const resultsDiv = document.getElementById("results");
        const placeholder = document.getElementById("placeholder");
        const userBudget = parseFloat(document.getElementById("userBudget").value);

        // Remove placeholder text
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

        // Retrieve dropdown values
        const location = document.getElementById("location").value;
        const budgetTier = document.getElementById("budgetTier").value;
        const equipment = document.getElementById("equipment").value;

        // Initialize cost variables
        let accommodationCost = 0;
        let transportCost = 0;
        let liftTicketCost = 0;
        let foodCost = 0;
        let transferCost = 0;
        let equipmentCost = 0;

        // Location cost logic
        if (location === "custom") {
            accommodationCost = (parseFloat(document.getElementById("customAccommodation").value) || 0) * Math.max(days - 1, 0);
            transportCost = parseFloat(document.getElementById("customTransport").value) || 0;
            liftTicketCost = (parseFloat(document.getElementById("customLiftTickets").value) || 0) * skiDays;
        } else {
            const locationCosts = {
                local: { accommodation: 150, travel: 250, liftTicket: 200 },
                interstate: { accommodation: 150, travel: 700, liftTicket: 200 },
                japan: { accommodation: 150, travel: 1800, liftTicket: 80 },
                canada: { accommodation: 150, travel: 4000, liftTicket: 100 },
            };
            const locationData = locationCosts[location];
            accommodationCost = Math.max(days - 1, 0) * locationData.accommodation;
            transportCost = locationData.travel;
            liftTicketCost = skiDays * locationData.liftTicket;
        }

        // Budget tier cost logic
        if (budgetTier === "custom") {
            foodCost = (parseFloat(document.getElementById("customFood").value) || 0) * days;
            transferCost = parseFloat(document.getElementById("customTransfers").value) || 0;
        } else {
            const budgetTierCosts = {
                low: { foodPerDay: 20, transferPerDay: 30 },
                mid: { foodPerDay: 50, transferPerDay: 60 },
                high: { foodPerDay: 100, transferPerDay: 100 },
            };
            const budgetTierData = budgetTierCosts[budgetTier];
            foodCost = budgetTierData.foodPerDay * days;
            transferCost = budgetTierData.transferPerDay * days;
        }

        // Equipment cost logic
        if (equipment === "custom") {
            equipmentCost = (parseFloat(document.getElementById("customEquipment").value) || 0) * Math.max(days - 2, 0);
        } else {
            const equipmentCosts = {
                hire: { perDay: 80, flatFee: 0 },
                gearTransport: { perDay: 0, flatFee: 200 },
                na: { perDay: 0, flatFee: 0 },
            };
            const equipmentData = equipmentCosts[equipment];
            equipmentCost = Math.max(days - 2, 0) * equipmentData.perDay + equipmentData.flatFee;
        }

        // Calculate total cost
        const totalCost = accommodationCost + transportCost + liftTicketCost + foodCost + transferCost + equipmentCost;

        // Compare total cost with user budget
        const budgetComparison = userBudget - totalCost;

        // Display results
        resultsDiv.innerHTML = `
            <h2>Results</h2>
            <p>Accommodation: $${accommodationCost.toFixed(2)}</p>
            <p>Transport: $${transportCost.toFixed(2)}</p>
            <p>Lift Tickets: $${liftTicketCost.toFixed(2)}</p>
            <p>Food: $${foodCost.toFixed(2)}</p>
            <p>Transfers: $${transferCost.toFixed(2)}</p>
            <p>Equipment: $${equipmentCost.toFixed(2)}</p>
            <h3>Total Cost: $${totalCost.toFixed(2)}</h3>
            <p>Your Budget: $${userBudget.toFixed(2)}</p>
            <p>Difference: ${budgetComparison >= 0 ? "Under budget by" : "Over budget by"} $${Math.abs(budgetComparison).toFixed(2)}</p>
            <img src="./images/${budgetComparison >= 0 ? "happy_face.jpg" : "sad_face.jpg"}" alt="${budgetComparison >= 0 ? "Happy Face" : "Sad Face"}" style="width: 100px; margin-top: 20px;">
        `;
    });

    // Budget Tier Info Dialog Logic
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
});
