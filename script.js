// ===== CART (products.html) =====
$(document).ready(function () {
  // In-memory array for cart items (resets on page refresh)
  let cart = [];

  // Add to Cart button
  $(".add-to-cart").click(function () {
    let name = $(this).data("name");
    let price = Number($(this).data("price"));

    // Check if the product is already in the cart
    let item = null;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].name === name) {
        item = cart[i];
        break;
      }
    }

    if (item) {
      item.quantity++;
    } else {
      cart.push({ name: name, price: price, quantity: 1 });
    }

    showCart();
    showMessage(name + " was added to your cart.", "text-success");
  });

  // Remove button inside the cart table
  $("#cart-items").on("click", ".remove-item", function () {
    let index = Number($(this).data("index"));
    cart.splice(index, 1);

    showCart();
    showMessage("Item removed.", "text-success");
  });

  // Clear Cart button
  $("#clear-cart").click(function () {
    cart = [];
    showCart();
    showMessage("Cart cleared.", "text-success");
  });

  // Place Order button
  $("#place-order").click(function () {
    if (cart.length === 0) {
      showMessage("Your cart is empty.", "text-danger");
      return;
    }

    cart = [];
    showCart();
    showMessage("Thank you! Your order was placed.", "text-success");
  });

  // Show the cart items and total
  function showCart() {
    $("#cart-items").empty();
    let total = 0;

    if (cart.length === 0) {
      $("#cart-items").html(
        '<tr><td colspan="5" class="text-center">Your cart is empty.</td></tr>'
      );
    }

    for (let i = 0; i < cart.length; i++) {
      let item = cart[i];
      let subtotal = item.price * item.quantity;
      total += subtotal;

      $("#cart-items").append(`
        <tr>
          <td>${item.name}</td>
          <td>₱${item.price.toFixed(2)}</td>
          <td>${item.quantity}</td>
          <td>₱${subtotal.toFixed(2)}</td>
          <td>
            <button class="btn btn-danger btn-sm remove-item" data-index="${i}">Remove</button>
          </td>
        </tr>
      `);
    }

    $("#total").text("₱" + total.toFixed(2));
  }

  // Show a message under the cart
  function showMessage(message, color) {
    $("#cart-message")
      .removeClass("text-success text-danger")
      .addClass(color)
      .text(message);
  }

  // Show the cart when the page loads
  showCart();
});

// ===== REVIEWS (reviews.html) =====
$(document).ready(function () {
  // In-memory array for reviews (resets on page refresh)
  let reviews = [];

  // Submit the review form
  $("#reviewForm").submit(function (event) {
    event.preventDefault();

    // Get form values
    let name = $("#reviewerName").val().trim();
    let rating = Number($("#rating").val());
    let reviewText = $("#reviewText").val().trim();

    // Validate input
    if (name === "" || rating < 1 || rating > 5 || reviewText === "") {
      showMessage("Please complete all fields correctly.", "danger");
      return;
    }

    // Get current date string manually
    let today = new Date();
    let dateString = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();

    // Create review object and add it to the array
    let review = {
      name: name,
      rating: rating,
      comment: reviewText,
      date: dateString,
    };
    reviews.push(review);

    displayReviews();
    $("#reviewForm")[0].reset();
    showMessage(
      "Thank you! Your review was submitted successfully.",
      "success"
    );
  });

  // Delete button
  $("#reviewsList").on("click", ".delete-review", function () {
    let index = Number($(this).attr("data-index"));

    reviews.splice(index, 1);

    displayReviews();
    showMessage("Review deleted successfully.", "success");
  });

  // Show all reviews, the average rating, and the total
  function displayReviews() {
    $("#reviewsList").empty();

    if (reviews.length === 0) {
      $("#reviewsList").html(`
        <div class="text-center py-4">
          <h3 class="h5 text-secondary">No Reviews Yet</h3>
          <p class="text-secondary mb-0">Be the first to share your experience!</p>
        </div>
      `);
    }

    let totalRating = 0;

    for (let i = 0; i < reviews.length; i++) {
      let review = reviews[i];
      totalRating += review.rating;

      // Stars, e.g. 4 -> ★★★★☆
      let stars = "";
      for (let s = 0; s < review.rating; s++) {
        stars += "★";
      }
      for (let s = 0; s < (5 - review.rating); s++) {
        stars += "☆";
      }

      // Build the review card
      let card = $("<div>").addClass("card border mb-3");
      let cardBody = $("<div>").addClass("card-body");

      let name = $("<h3>").addClass("h5 card-title fw-bold").text(review.name);

      let deleteButton = $("<button>")
        .addClass("btn btn-outline-danger btn-sm delete-review")
        .attr("type", "button")
        .attr("aria-label", "Delete review")
        .attr("data-index", i)
        .html('<i class="bi bi-trash"></i>');

      let header = $("<div>")
        .addClass("d-flex justify-content-between align-items-center mb-2")
        .append(name, deleteButton);

      let rating = $("<p>").addClass("text-warning h5").text(stars);
      let comment = $("<p>").addClass("card-text").text(review.comment);
      let date = $("<small>")
        .addClass("text-secondary")
        .text("Posted on: " + review.date);

      cardBody.append(header, rating, comment, date);
      card.append(cardBody);
      $("#reviewsList").append(card);
    }

    // Update the summary
    let average = reviews.length > 0 ? totalRating / reviews.length : 0;
    $("#averageRating").text(average.toFixed(1));
    $("#reviewCount").text(reviews.length);
  }

  // Show a feedback message
  function showMessage(message, type) {
    $("#message")
      .removeClass("d-none alert-success alert-danger")
      .addClass("alert-" + type)
      .text(message);
  }

  // Show reviews when the page loads
  displayReviews();
});

// ===== CONTACT FORM (contact.html) =====
$(document).ready(function () {
  // Submit the contact form
  $("#contactForm").submit(function (event) {
    event.preventDefault();

    // Get form values
    let name = $("#contactName").val().trim();
    let email = $("#contactEmail").val().trim();
    let message = $("#contactMessage").val().trim();

    // Validate input
    if (name === "" || email === "" || message === "") {
      showMessage("Please complete all fields.", "danger");
      return;
    }

    // Clear the form and show confirmation
    $("#contactForm")[0].reset();
    showMessage("Thank you, " + name + "! Your message was sent.", "success");
  });

  // Show a feedback message
  function showMessage(message, type) {
    $("#message")
      .removeClass("d-none alert-success alert-danger")
      .addClass("alert-" + type)
      .text(message);
  }
});
