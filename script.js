document.addEventListener("DOMContentLoaded", () => {
    // --- LOGIN FORM VALIDATION ---
    const loginForm = document.querySelector('form[action="/login"]');
  
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        const email = loginForm.email.value.trim();
        const password = loginForm.password.value.trim();
  
        if (!email || !password) {
          e.preventDefault();
          alert("Login Error: Please fill in both email and password.");
        } else if (!email.includes("@")) {
          e.preventDefault();
          alert("Login Error: Please enter a valid email address.");
        }
        // You can add more specific login validation here (e.g., regex for email format)
      });
    }
  
    // --- SIGNUP FORM VALIDATION ---
    const signupForm = document.querySelector('form[action="/signup"]');
  
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        const name = signupForm.name.value.trim();
        const email = signupForm.email.value.trim();
        const password = signupForm.password.value.trim();
  
        if (!name || !email || !password) {
          e.preventDefault();
          alert("Signup Error: All fields are required.");
        } else if (!email.includes("@")) {
          // Basic email check
          e.preventDefault();
          alert("Signup Error: Please enter a valid email address.");
        } else if (password.length < 6) {
          // Minimum password length
          e.preventDefault();
          alert("Signup Error: Password should be at least 6 characters.");
        }
        // You can add more robust email regex or password complexity rules here if desired
      });
    }
  
    // --- PASSWORD TOGGLE FUNCTIONALITY FOR LOGIN FORM ---
    // Ensure your login.html has an input with id="password" and a toggle with id="password-toggle"
    const loginPasswordToggle = document.getElementById("password-toggle");
    const loginPasswordInput = document.getElementById("password");
  
    if (loginPasswordToggle && loginPasswordInput) {
      loginPasswordToggle.addEventListener("click", () => {
        // Toggle the type attribute between 'password' and 'text'
        const type =
          loginPasswordInput.getAttribute("type") === "password"
            ? "text"
            : "password";
        loginPasswordInput.setAttribute("type", type);
  
        // Toggle the eye icon (fa-eye / fa-eye-slash) for visual feedback
        const icon = loginPasswordToggle.querySelector("i");
        if (icon) {
          icon.classList.toggle("fa-eye");
          icon.classList.toggle("fa-eye-slash");
        }
      });
    }
  
    // --- PASSWORD TOGGLE FUNCTIONALITY FOR SIGNUP FORM ---
    // Ensure your signup.html has an input with id="signup-password" and a toggle with id="signup-password-toggle"
    const signupPasswordToggle = document.getElementById("signup-password-toggle");
    const signupPasswordInput = document.getElementById("signup-password");
  
    if (signupPasswordToggle && signupPasswordInput) {
      signupPasswordToggle.addEventListener("click", () => {
        // Toggle the type attribute between 'password' and 'text'
        const type =
          signupPasswordInput.getAttribute("type") === "password"
            ? "text"
            : "password";
        signupPasswordInput.setAttribute("type", type);
  
        // Toggle the eye icon (fa-eye / fa-eye-slash) for visual feedback
        const icon = signupPasswordToggle.querySelector("i");
        if (icon) {
          icon.classList.toggle("fa-eye");
          icon.classList.toggle("fa-eye-slash");
        }
      });
    }
  
    // --- CART FUNCTIONALITY ---
    let cart = []; // Declared once and within the DOMContentLoaded scope
  
    // Get references to cart-related HTML elements
    const showCartButton = document.getElementById("show-cart");
    const cartModal = document.getElementById("cart-modal");
    const cartItemsList = document.getElementById("cart-items");
    const cartTotalSpan = document.getElementById("cart-total");
  
    // Add to Cart logic: Attaches event listener to all "Add to Cart" buttons
    // IMPORTANT: Using '.masonry-item' to match your HTML structure
    document.querySelectorAll(".masonry-item button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const productCard = btn.closest(".masonry-item"); // Find the parent product card
        const title = productCard.querySelector("h3").innerText.trim();
        const priceText = productCard.querySelector("span").innerText.trim();
        // const image = productCard.querySelector("img").src; // Image isn't used in cart modal display but can be stored
  
        // Extract numerical price from the text (e.g., "₹45,000" -> 45000)
        const price = parseFloat(priceText.replace("₹", "").replace(/,/g, "")); // Handle commas in price
  
        // Create a unique ID for the item to check for existing entries
        const id = `${title}-${price}`;
  
        // Check if item already exists in cart to update quantity
        const existingItem = cart.find((item) => item.id === id);
  
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ id, title, price, quantity: 1 });
        }
  
        updateCartCount(); // Update the cart icon count
  
        // Automatically "click" the "Show Cart" button to display the modal
        if (showCartButton) {
          showCartButton.click();
        }
      });
    });
  
    // Function to update the number of items displayed in the cart icon
    function updateCartCount() {
      const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);
      document.getElementById("cart-count").innerText = `(${totalItemsInCart})`; // Display with parentheses
    }
  
    // Function to display/update the cart modal
    function showCart() {
      cartItemsList.innerHTML = ""; // Clear previous items in the modal list
      let total = 0;
  
      if (cart.length === 0) {
        cartItemsList.innerHTML = "<li>Your cart is empty.</li>";
      } else {
        // Populate the modal with current cart items
        cart.forEach((item, index) => {
          const listItem = document.createElement("li");
          const itemTotal = item.price * item.quantity;
          total += itemTotal; // Add to overall cart total
  
          // Display item title, quantity, subtotal, and a remove button
          listItem.innerHTML = `
            <span>${item.title} × ${item.quantity} - ₹${itemTotal.toLocaleString("en-IN")}</span>
            <button class="remove-item-btn" data-index="${index}">Remove</button>
          `;
          cartItemsList.appendChild(listItem);
        });
      }
  
      // Display the total price, formatted
      cartTotalSpan.innerText = total.toLocaleString("en-IN");
  
      // Add event listeners to dynamically created "Remove" buttons
      cartItemsList.querySelectorAll(".remove-item-btn").forEach((removeBtn) => {
        removeBtn.addEventListener("click", (e) => {
          const indexToRemove = parseInt(e.target.dataset.index); // Get the index of the item to remove
          // Remove item from the cart array using its index
          cart.splice(indexToRemove, 1);
          updateCartCount(); // Update cart icon count
          showCart(); // Re-render the cart modal to reflect changes
        });
      });
  
      cartModal.style.display = "block"; // Make the cart modal visible
    }
  
    // Function to close the cart modal (accessible globally for HTML onclick)
    window.closeCart = function () {
      cartModal.style.display = "none"; // Hide the cart modal
    };
  
    // Event listener for the "Show Cart" link in the navbar
    if (showCartButton) {
      showCartButton.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default link behavior (e.g., jumping to #)
        showCart(); // Call the function to display the cart modal
      });
    }
  
    // Initialize cart count on page load
    updateCartCount();
  });
  
  // If you need removeFromCart to be called directly from HTML's onclick (not recommended for dynamic lists),
  // you would also make it global, but it's better to handle it within showCart() as above.
  /*
  window.removeFromCart = function(index) {
      cart.splice(index, 1);
      updateCartCount();
      document.getElementById('show-cart').click(); // Re-open/refresh modal after removal
  };
  */