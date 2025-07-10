const storeName = Shopify.shop.split(".")[0];
let Content, imageUrl, ctaText, Title, delay, scrollPercentage, exitIntentActive, email, phone;

const checkApi = async (onSuccess) => {
  try {
    const response = await fetch(`https://${Shopify.shop}/apps/optistep/get-popup?storeName=${storeName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Proxy error: ${text}`);
    }

    const data = await response.json();
    console.log("✅ Proxy API Response:", data);

    imageUrl = data.popup.Image;
    Content = data.popup.Content;
    ctaText = data.popup.ctaText;
    Title = data.popup.title;
    delay = data.popup.delaySeconds;
    scrollPercentage = data.popup.scrollPercentage;
    exitIntentActive = data.popup.exitIntent;
    email = data.popup.collectEmail;
    phone = data.popup.collectSMS;
    onSuccess(); // Proceed to create popup once data is ready
  } catch (error) {
    console.error("❌ Proxy API Error:", error.message);
  }
};


const createUser = async (emailvalue, phonevalue) => {
  try {
    const response = await fetch(`https://${Shopify.shop}/apps/optistep/create-popup-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Useremail: emailvalue,
        userPhone: phonevalue,
        store_Id: storeName
      }),
    });

    const responseText = await response.text();
    if (!response.ok) throw new Error(responseText);

    try {
      const data = JSON.parse(responseText);
      console.log("✅ User created:", data);
    } catch (e) {
      throw new Error("Invalid JSON response: " + responseText);
    }
  } catch (error) {
    console.error("❌ User creation failed:", error.message);
  }
};


window.addEventListener('DOMContentLoaded', () => {
  console.log("store_Id");
  const body = document.getElementsByTagName("body")[0];
  let popupShown = false;
  let modal;

  const togglePopup = (forceShow = false) => {
    if (!popupShown || forceShow) {
      modal.classList.toggle('hidden');
      document.body.style.overflow = modal.classList.contains('hidden') ? '' : 'hidden';
      popupShown = !modal.classList.contains('hidden');
    }
  };

  checkApi(() => {
    // ✅ Build popup after API response
    modal = document.createElement('div');
    modal.id = 'popupModal';
    modal.className = 'popup-overlay hidden';

    const popupBox = document.createElement('div');
    popupBox.className = 'popup-box';

    const imageSection = document.createElement('div');
    imageSection.className = 'popup-image';
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Popup Image';
    imageSection.appendChild(img);

    const contentSection = document.createElement('div');
    contentSection.className = 'popup-content';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'popup-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => togglePopup(true);
    contentSection.appendChild(closeBtn);

    const heading = document.createElement('h2');
    heading.innerText = Title || 'Special Offer!';

    const paragraph = document.createElement('p');
    paragraph.innerText = Content || 'Subscribe now and get 10% off your first order!';

    const emailLabel = document.createElement('label');
    emailLabel.innerText = 'Email';
    emailLabel.className = 'popup-email-label';

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.placeholder = 'Your@email.com';
    emailInput.className = 'popup-input';

    const phoneLabel = document.createElement('label');
    phoneLabel.innerText = 'Phone';
    phoneLabel.className = 'popup-phone-label';

    const phoneInput = document.createElement('input');
    phoneInput.type = 'text';
    phoneInput.placeholder = '+1(123) 456-7890';
    phoneInput.className = 'popup-input';

    const ctaButton = document.createElement('button');
    ctaButton.className = 'popup-cta';
    ctaButton.innerText = ctaText || 'Get My Discount';
    ctaButton.onclick = () => {
      const emailvalue = emailInput.value.trim();
      const phonevalue = phoneInput.value.trim();
      togglePopup(true);
      createUser(emailvalue, phonevalue);
    };


    const skipButton = document.createElement('button');
    skipButton.className = 'popup-skip';
    skipButton.innerText = 'No thanks';
    skipButton.onclick = () => togglePopup(true);

    // Append all
    contentSection.appendChild(heading);
    contentSection.appendChild(paragraph);
    if (email) { contentSection.appendChild(emailLabel); contentSection.appendChild(emailInput) };
    if (phone) { contentSection.appendChild(phoneLabel); contentSection.appendChild(phoneInput) };
    contentSection.appendChild(ctaButton);
    contentSection.appendChild(skipButton);

    popupBox.appendChild(imageSection);
    popupBox.appendChild(contentSection);
    modal.appendChild(popupBox);
    body.appendChild(modal);

    // Trigger button
    const triggerBtn = document.createElement('button');
    triggerBtn.innerText = "Show Popup";
    triggerBtn.onclick = () => togglePopup(true);
    // document.body.appendChild(triggerBtn);

    if (delay > 0) {

      // Delay trigger
      setTimeout(() => {
        if (!popupShown) {
          console.log("Popup triggered after delay");
          togglePopup(true);
        }
      }, delay * 1000);
    }

    if (exitIntentActive) {
      // Exit intent trigger
      document.addEventListener("mouseout", function (e) {
        if (!e.toElement && !e.relatedTarget && e.clientY <= 0 && !popupShown) {
          console.log("Exit intent detected");
          togglePopup(true);
        }
      });
    }

    if (scrollPercentage > 0) {
      // Scroll trigger
      let lastTriggerScroll = 0;
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY - lastTriggerScroll >= scrollPercentage * 1000) {
          console.log("Popup triggered on scroll", scrollY);
          togglePopup(true);
          lastTriggerScroll = scrollY;
        }
      });
    }
  });
});
