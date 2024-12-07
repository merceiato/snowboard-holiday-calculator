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

    // Toggle custom input fields based on dropdown selection
    const toggleCustomFields = (dropdown, customFieldsContainer) => {
        dropdown.addEventListener("change", () => {
            if (dropdown.value === "custom") {
                customFieldsContainer.classList.remove("hidden");
            } else {
                customFieldsContainer.classList.add("hidden");
            }
        });
    };

    toggleCustomFields(document.getElementById("location"), document.getElementById("customLocationFields"));
    toggleCustomFields(document.getElementById("budgetTier"), document.getElementById("customBudgetTierFields"));
    toggleCustomFields(document.getElementById("equipment"), document.getElementById("customEquipmentField"));

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

        const location = document.getElementById("location").value;
        const budgetTier = document.getElementById("budgetTier").value;
        const equipment = document.getElementById("equipment").value;

        // Calculate costs
        let accommodationCost = 0;
        let transportCost = 0;
        let liftTicketCost = 0;
        let foodCost = 0;
        let transferCost = 0;
        let equipmentCost = 0;

        if (location === "custom") {
            accommodationCost = (parseFloat(document.getElementById("customAccommodation").value) || 0) * (days - 1);
            transportCost = parseFloat(document.getElementById("customTransport").value) || 0;
            liftTicketCost = (parseFloat(document.getElementById("customLiftTickets").value) || 0) * skiDays; // Adjust lift tickets
        } else {
            const locationCosts = {
                local: { accommodation: 150, travel: 250, liftTicket: 200 },
                interstate: { accommodation: 150, travel: 700, liftTicket: 200 },
                japan: { accommodation: 150, travel: 1800, liftTicket: 80 },
                canada: { accommodation: 150, travel: 4000, liftTicket: 100 },
            };
            const locationData = locationCosts[location];
            accommodationCost = (days - 1) * locationData.accommodation; // Adjust for days - 1
            transportCost = locationData.travel;
            liftTicketCost = skiDays * locationData.liftTicket; // Adjust lift tickets
        }

        if (budgetTier === "custom") {
            foodCost = (parseFloat(document.getElementById("customFood").value) || 0) * days;
            transferCost = parseFloat(document.getElementById("customTransfers").value) || 0;
        }

        if (equipment === "custom") {
            equipmentCost = (parseFloat(document.getElementById("customEquipment").value) || 0) * (days - 2); // Adjust for days - 2
        } else {
            const equipmentCosts = {
                hire: { perDay: 80, flatFee: 0 },
                gearTransport: { perDay: 0, flatFee: 200 },
                na: { perDay: 0, flatFee: 0 },
            };
            const equipmentData = equipmentCosts[equipment];
            equipmentCost = Math.max(days - 2, 0) * equipmentData.perDay + equipmentData.flatFee; // Adjust for days - 2
        }

        const totalCost = accommodationCost + transportCost + liftTicketCost + foodCost + transferCost + equipmentCost;

        // Compare total cost with budget
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
});
