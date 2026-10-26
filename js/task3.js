
const TICKET_PRICES = {
    Standard: 50,
    VIP: 120,
    Student: 30
};

const AVAILABLE_SEATS = [
    { date: "2026-11-15", seats: 5 },
    { date: "2026-12-10", seats: 2 },
    { date: "2026-12-20", seats: 0 }
];

const PROMO_CODES = {
    SAVE10: 0.10,
    STUDENT20: 0.20
};

const ticketForm = document.querySelector("#ticketForm");
const ticketErrors = document.querySelector("#ticketErrors");
const bookingResult = document.querySelector("#bookingResult");

const fields = {
    customerName: document.querySelector("#customerName"),
    customerEmail: document.querySelector("#customerEmail"),
    eventDate: document.querySelector("#eventDate"),
    ticketType: document.querySelector("#ticketType"),
    quantity: document.querySelector("#quantity"),
    promoCode: document.querySelector("#promoCode")
};

const errorElements = {
    customerName: document.querySelector("#customerNameError"),
    customerEmail: document.querySelector("#customerEmailError"),
    eventDate: document.querySelector("#eventDateError"),
    ticketType: document.querySelector("#ticketTypeError"),
    quantity: document.querySelector("#quantityError"),
    promoCode: document.querySelector("#promoCodeError")
};

const touchedFields = new Set();

ticketForm.noValidate = true;

function getFieldError(fieldName) {
    const value = fields[fieldName].value.trim();

    if (fieldName === "customerName") {
        if (value.length < 2) {
            return "Name must contain at least 2 characters.";
        }

        if (!/^[\p{L}\p{M} '-]+$/u.test(value)) {
            return "Use letters, spaces, apostrophes or hyphens only.";
        }
    }

    if (fieldName === "customerEmail") {
        if (!fields.customerEmail.validity.valid || value === "") {
            return "Enter a valid email address.";
        }
    }

    if (fieldName === "eventDate") {
        if (value === "") {
            return "Please select an event date.";
        }

        const event = AVAILABLE_SEATS.find(
            item => item.date === value
        );

        if (!event || event.seats === 0) {
            return "This event date is sold out.";
        }
    }

    if (fieldName === "ticketType") {
        if (!Object.hasOwn(TICKET_PRICES, value)) {
            return "Please select a valid ticket type.";
        }
    }

    if (fieldName === "quantity") {
        const quantity = Number(value);

        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 6) {
            return "Quantity must be a whole number from 1 to 6.";
        }

        const event = AVAILABLE_SEATS.find(
            item => item.date === fields.eventDate.value
        );

        if (event && quantity > event.seats) {
            return `Only ${event.seats} seat(s) are available for this date.`;
        }
    }

    if (fieldName === "promoCode") {
        if (value !== "" && !Object.hasOwn(PROMO_CODES, value.toUpperCase())) {
            return "Invalid promo code. Try SAVE10 or STUDENT20.";
        }
    }

    return "";
}

function validateField(fieldName) {
    const error = getFieldError(fieldName);

    errorElements[fieldName].textContent = error;
    fields[fieldName].setAttribute(
        "aria-invalid",
        error ? "true" : "false"
    );

    return error === "";
}

function validateAllFields() {
    let errorCount = 0;
    let firstInvalidField = null;

    for (const fieldName of Object.keys(fields)) {
        touchedFields.add(fieldName);

        if (!validateField(fieldName)) {
            errorCount++;

            if (firstInvalidField === null) {
                firstInvalidField = fields[fieldName];
            }
        }
    }

    if (errorCount > 0) {
        ticketErrors.textContent =
            `Please correct ${errorCount} error(s) before booking.`;

        firstInvalidField.focus();
        return false;
    }

    ticketErrors.textContent = "";
    return true;
}

function calculateTotal() {
    const type = fields.ticketType.value;
    const quantity = Number(fields.quantity.value);

    if (
        !Object.hasOwn(TICKET_PRICES, type) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 6
    ) {
        return null;
    }

    const event = AVAILABLE_SEATS.find(
        item => item.date === fields.eventDate.value
    );

    if (!event || event.seats < quantity) {
        return null;
    }

    const promoCode = fields.promoCode.value.trim().toUpperCase();
    const discount = PROMO_CODES[promoCode] || 0;

    return TICKET_PRICES[type] * quantity * (1 - discount);
}

function updatePreview() {
    document.querySelector("#previewName").textContent =
        fields.customerName.value.trim() || "Not entered";

    const selectedDate = fields.eventDate.selectedOptions[0];

    document.querySelector("#previewDate").textContent =
        fields.eventDate.value ? selectedDate.textContent : "Not selected";

    document.querySelector("#previewType").textContent =
        fields.ticketType.value || "Not selected";

    document.querySelector("#previewQuantity").textContent =
        fields.quantity.value || "0";

    const total = calculateTotal();

    document.querySelector("#previewTotal").textContent =
        total === null ? "Unavailable" : `$${total.toFixed(2)}`;

    const promoCode = fields.promoCode.value.trim().toUpperCase();
    const promoMessage = document.querySelector("#previewPromo");

    if (promoCode === "") {
        promoMessage.textContent = "Enter a promo code for a discount.";
    } else if (Object.hasOwn(PROMO_CODES, promoCode)) {
        promoMessage.textContent =
            `${promoCode} discount: ${PROMO_CODES[promoCode] * 100}%`;
    } else {
        promoMessage.textContent = "Promo code is not valid.";
    }
}

for (const fieldName of Object.keys(fields)) {
    const field = fields[fieldName];

    field.addEventListener("blur", function () {
        touchedFields.add(fieldName);
        validateField(fieldName);
    });

    field.addEventListener("input", function () {
        bookingResult.replaceChildren();
        ticketErrors.textContent = "";

        if (touchedFields.has(fieldName)) {
            validateField(fieldName);
        }

        if (fieldName === "eventDate" || fieldName === "quantity") {
            for (const relatedField of ["eventDate", "quantity"]) {
                if (touchedFields.has(relatedField)) {
                    validateField(relatedField);
                }
            }
        }

        updatePreview();
    });

    field.addEventListener("change", function () {
        if (touchedFields.has(fieldName)) {
            validateField(fieldName);
        }

        if (fieldName === "eventDate" || fieldName === "quantity") {
            for (const relatedField of ["eventDate", "quantity"]) {
                if (touchedFields.has(relatedField)) {
                    validateField(relatedField);
                }
            }
        }

        updatePreview();
    });
}

function createBookingCode() {
    return "GZ-" + Math.floor(100000 + Math.random() * 900000);
}

ticketForm.addEventListener("submit", function (event) {
    event.preventDefault();
    bookingResult.replaceChildren();

    if (!validateAllFields()) {
        return;
    }

    const total = calculateTotal();

    if (total === null) {
        ticketErrors.textContent =
            "The selected ticket combination is not available.";
        return;
    }

    const eventInfo = AVAILABLE_SEATS.find(
        item => item.date === fields.eventDate.value
    );

    const quantity = Number(fields.quantity.value);
    const bookingCode = createBookingCode();

    eventInfo.seats -= quantity;

    const heading = document.createElement("h3");
    heading.textContent = "Booking Confirmed!";

    const details = document.createElement("p");
    details.textContent =
        `Booking ${bookingCode} | ${fields.customerName.value.trim()} | ` +
        `${fields.ticketType.value} | ${quantity} ticket(s) | ` +
        `${fields.eventDate.value} | $${total.toFixed(2)}`;

    const notice = document.createElement("p");
    notice.textContent =
        "Your booking has been created in this demo.";

    bookingResult.append(heading, details, notice);

    ticketForm.reset();
    touchedFields.clear();

    for (const fieldName of Object.keys(fields)) {
        errorElements[fieldName].textContent = "";
        fields[fieldName].setAttribute("aria-invalid", "false");
    }

    updatePreview();
    bookingResult.focus();
});

updatePreview();
