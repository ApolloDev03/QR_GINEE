import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // useNavigate for redirection
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS
import { apiUrl } from "../config";

function QuickContact() {
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState(null); // State to track selected message
  const [error, setError] = useState(null); // State to track any errors
  const [filteredMessages, setFilteredMessages] = useState([]); // State for filtered messages
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");

  const quickContactImg = "assests/image/quick_final.png";
  const logoImg = "assests/image/new_logo_qr.png";

  // Static content with unique IDs and icons
  const staticMessages = [
    // car sms
    {
      id: "6",
      text: "The lights of the car is on",
      // icon: "assests/image/quick_icons/Emer1.png",
      svgicon: `<svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.8966 2.44982L13.1294 4.21832L14.3084 5.39649L16.0756 3.62799L14.8966 2.44982Z" fill="#292929"/>
<path d="M17.3332 12H0.666504V13.6667H17.3332V12Z" fill="#292929"/>
<path d="M9.83317 0.333313H8.1665V2.83331H9.83317V0.333313Z" fill="#292929"/>
<path d="M3.13065 2.4255L1.95215 3.604L3.7199 5.37175L4.8984 4.19325L3.13065 2.4255Z" fill="#292929"/>
<path d="M3.1665 10.3333H14.8332C14.8332 7.10833 12.2248 4.5 8.99984 4.5C5.77484 4.5 3.1665 7.10833 3.1665 10.3333Z" fill="#292929"/>
</svg>`,
      type: 1,
    },
    {
      id: "9",
      text: "The car is in no parking zone",
      svgicon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1483_842)">
<g clip-path="url(#clip1_1483_842)">
<path d="M10.5833 4.75H6.5V15.25H8.83333V11.75H10.5833C12.5142 11.75 14.0833 10.1808 14.0833 8.25C14.0833 6.31917 12.5142 4.75 10.5833 4.75ZM10.7 9.41667H8.83333V7.08333H10.7C11.3417 7.08333 11.8667 7.60833 11.8667 8.25C11.8667 8.89167 11.3417 9.41667 10.7 9.41667Z" fill="#292929"/>
</g>
<path d="M9.99984 1.66669C5.39984 1.66669 1.6665 5.40002 1.6665 10C1.6665 14.6 5.39984 18.3334 9.99984 18.3334C14.5998 18.3334 18.3332 14.6 18.3332 10C18.3332 5.40002 14.5998 1.66669 9.99984 1.66669ZM3.33317 10C3.33317 6.31669 6.3165 3.33335 9.99984 3.33335C11.5415 3.33335 12.9582 3.85835 14.0832 4.74169L4.7415 14.0834C3.85817 12.9584 3.33317 11.5417 3.33317 10ZM9.99984 16.6667C8.45817 16.6667 7.0415 16.1417 5.9165 15.2584L15.2582 5.91669C16.1415 7.04169 16.6665 8.45835 16.6665 10C16.6665 13.6834 13.6832 16.6667 9.99984 16.6667Z" fill="#292929"/>
</g>
<defs>
<clipPath id="clip0_1483_842">
<rect width="20" height="20" fill="white"/>
</clipPath>
<clipPath id="clip1_1483_842">
<rect width="14" height="14" fill="white" transform="translate(3 3)"/>
</clipPath>
</defs>
</svg>`,
      icon: "assests/image/quick_icons/Emer2.png",
      type: 1,
    },
    {
      id: "2",
      text: "The car is getting towed",
      svgicon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="20" height="20" fill="white"/>
<path d="M11.2905 14.1105H10.621V14.1072L11.2905 14.1105Z" fill="#292929"/>
<path d="M10.6243 13.441L10.631 10.7763L10.6343 9.58457V8.90166L10.6377 8.08484C10.641 7.72665 10.7816 7.39189 11.0327 7.13747C11.2871 6.8864 11.6118 6.75584 11.9834 6.74915L14.0389 6.75584C14.551 6.75584 15.0097 7.04039 15.2339 7.49901L16.5295 10.1101L17.9991 10.1135C18.2669 10.1168 18.5179 10.2206 18.7088 10.4114C18.8962 10.6022 19 10.8533 19 11.1211L18.9933 13.1297C18.9933 13.682 18.5414 14.1306 17.989 14.1306H17.6208C17.6409 14.0201 17.6509 13.9097 17.6509 13.7959C17.6509 13.682 17.6442 13.5682 17.6241 13.4611C17.6208 13.4477 17.6208 13.4377 17.6174 13.4243C17.6174 13.4142 17.6141 13.4075 17.6107 13.3975C17.6074 13.3774 17.6041 13.3573 17.5974 13.3406C17.594 13.3138 17.5873 13.287 17.5806 13.2636C17.5773 13.2469 17.5739 13.2335 17.5672 13.2167C17.5605 13.1933 17.5538 13.1665 17.5438 13.1431C17.5304 13.0996 17.5137 13.056 17.4936 13.0125V13.0058C17.4701 12.9556 17.4467 12.9054 17.4199 12.8552C17.3998 12.8184 17.3798 12.7815 17.353 12.7447C17.3362 12.7112 17.3162 12.6811 17.2961 12.651C17.2659 12.6041 17.2291 12.5572 17.1923 12.5137C17.1555 12.4669 17.1153 12.4233 17.0751 12.3832L17.0651 12.3731C17.0182 12.3263 16.9714 12.2827 16.9211 12.2426C16.881 12.2091 16.8408 12.1756 16.7939 12.1455C16.7605 12.1221 16.727 12.0986 16.6902 12.0785C16.6801 12.0685 16.6701 12.0618 16.6567 12.0584C16.6199 12.035 16.583 12.0149 16.5429 11.9948C16.4726 11.958 16.3989 11.9279 16.3219 11.9011C16.2784 11.8844 16.2315 11.8676 16.188 11.8576C16.1445 11.8442 16.0976 11.8308 16.0508 11.8241C16.0106 11.8141 15.9671 11.8074 15.9202 11.8007C15.8934 11.7973 15.8633 11.794 15.8332 11.7906C15.7729 11.7839 15.7127 11.7806 15.6491 11.7806H15.6424C15.1101 11.7806 14.6079 11.9882 14.2263 12.3664C14.1795 12.4133 14.1359 12.4602 14.0958 12.5104C14.0891 12.5171 14.0857 12.5204 14.0824 12.5271C14.0489 12.5673 14.0154 12.6108 13.9886 12.6543C13.9786 12.6644 13.9719 12.6744 13.9686 12.6845C13.9317 12.7347 13.9016 12.7882 13.8748 12.8384C13.8447 12.892 13.8179 12.9489 13.7945 13.0058C13.771 13.0594 13.751 13.1163 13.7342 13.1732C13.7275 13.1799 13.7275 13.1899 13.7242 13.2C13.7108 13.2368 13.7007 13.2736 13.6941 13.3138C13.6807 13.354 13.674 13.3941 13.6673 13.4343C13.6639 13.4377 13.6639 13.4444 13.6639 13.4477C13.6438 13.5582 13.6338 13.6686 13.6338 13.7825L13.6639 14.1172L11.2905 14.1105L10.621 14.1072L10.6243 13.441ZM13.4095 10.003C13.4731 10.0666 13.5568 10.1001 13.6472 10.1001L15.7796 10.1068L14.6347 7.79695C14.5209 7.56931 14.2933 7.42536 14.0389 7.42536L13.3191 7.42201L13.3124 9.76534C13.3124 9.85572 13.3459 9.93941 13.4095 10.003Z" fill="#292929"/>
<path d="M3.95588 13.421C4.02618 13.0126 4.22034 12.6343 4.51827 12.3364C4.8999 11.9615 5.40204 11.7539 5.93431 11.7539H5.94101C6.47662 11.7539 6.98211 11.9648 7.36039 12.3464C7.65833 12.6444 7.85249 13.0227 7.91609 13.4311C7.93618 13.5415 7.94287 13.652 7.94287 13.7658C7.94287 13.8796 7.93283 13.9935 7.91274 14.1006C7.84579 14.5123 7.65163 14.8873 7.35035 15.1852C6.97207 15.5635 6.46993 15.771 5.93766 15.771H5.93096C4.93673 15.7677 4.10987 15.0413 3.95588 14.0905C3.93579 13.9801 3.92575 13.8696 3.92575 13.7558C3.92575 13.642 3.93579 13.5315 3.95588 13.421ZM5.93096 15.1015C6.2925 15.0948 6.62726 14.9643 6.87833 14.7098C7.13275 14.4588 7.27335 14.124 7.27335 13.7658C7.2767 13.4076 7.1361 13.0695 6.88503 12.8184C6.63396 12.564 6.29585 12.4234 5.94101 12.4234H5.93431C5.19784 12.4234 4.59862 13.0193 4.59527 13.7558C4.59527 14.4956 5.19449 15.0982 5.93096 15.1015Z" fill="#292929"/>
<path d="M13.6658 13.421C13.7361 13.0126 13.9303 12.6343 14.2282 12.3364C14.6099 11.9615 15.112 11.7539 15.6443 11.7539H15.651C16.1866 11.7539 16.6921 11.9648 17.0703 12.3464C17.3683 12.6444 17.5624 13.0227 17.6261 13.4311C17.6461 13.5415 17.6528 13.652 17.6528 13.7658C17.6528 13.8796 17.6428 13.9935 17.6227 14.1006C17.5558 14.5123 17.3616 14.8873 17.0603 15.1852C16.682 15.5635 16.1799 15.771 15.6476 15.771H15.6409C14.6467 15.7677 13.8198 15.0413 13.6658 14.0905C13.6458 13.9801 13.6357 13.8696 13.6357 13.7558C13.6357 13.642 13.6458 13.5315 13.6658 13.421ZM15.6409 15.1015C16.0025 15.0948 16.3372 14.9643 16.5883 14.7098C16.8427 14.4588 16.9833 14.124 16.9833 13.7658C16.9867 13.4076 16.8461 13.0695 16.595 12.8184C16.3439 12.564 16.0058 12.4234 15.651 12.4234H15.6443C14.9078 12.4234 14.3086 13.0193 14.3052 13.7558C14.3052 14.4956 14.9045 15.0982 15.6409 15.1015Z" fill="#292929"/>
<path d="M3.41369 6.83282C3.48064 7.00689 3.58107 7.16758 3.71832 7.30483L3.80201 7.38852L6.8115 10.4181H7.75887L8.53217 10.4215C8.63595 10.4281 8.75311 10.3779 8.83345 10.2976C8.9138 10.2172 8.96066 10.1101 8.96066 9.9963C8.96066 9.90257 8.97071 9.81553 8.99749 9.7285C9.05105 9.49751 9.18495 9.29331 9.36572 9.14936L5.63649 5.39669C5.23143 4.99163 4.61213 4.88451 4.09325 5.13223C3.69489 5.32305 3.42038 5.68459 3.34674 6.11978C3.30322 6.3675 3.32665 6.61187 3.41369 6.83282Z" fill="#292929"/>
<path d="M2.58999 13.0828C2.58999 13.3506 2.69377 13.6017 2.88123 13.7925C3.07204 13.9833 3.32311 14.0871 3.59092 14.0871L3.95581 14.0905C3.93573 13.98 3.92568 13.8695 3.92568 13.7557C3.92568 13.6419 3.93573 13.5314 3.95581 13.4209C4.02611 13.0125 4.22027 12.6343 4.51821 12.3363C4.89984 11.9614 5.40198 11.7538 5.93424 11.7538H5.94094C6.47656 11.7538 6.98204 11.9647 7.36032 12.3464C7.65826 12.6443 7.85242 13.0226 7.91602 13.431C7.93611 13.5415 7.94281 13.6519 7.94281 13.7657C7.94281 13.8796 7.93276 13.9934 7.91268 14.1005L10.6209 14.1072L10.6242 13.441L10.6309 10.7763L10.6343 9.58458V8.90167H10.0551C9.79403 8.90167 9.553 8.99206 9.36554 9.1494C9.18477 9.29334 9.05086 9.49755 8.9973 9.72853C8.97052 9.81557 8.96048 9.90261 8.96048 9.99634C8.96048 10.1102 8.91361 10.2173 8.83327 10.2976C8.75292 10.378 8.63576 10.4282 8.53198 10.4215L7.75869 10.4181H6.81132L3.6947 10.4081H3.69135C3.40011 10.4081 3.12561 10.5186 2.91806 10.7261C2.7105 10.9303 2.59669 11.2082 2.59334 11.4994L2.58999 13.0828Z" fill="#292929"/>
<path d="M1.0003 7.05047C0.996956 7.39862 1.13086 7.72333 1.37523 7.97106C1.61961 8.21543 1.94768 8.35268 2.29248 8.35268H2.29583C2.64398 8.35268 2.96869 8.21878 3.21307 7.97441L3.80225 7.38857L3.71856 7.30488C3.5813 7.16763 3.48088 7.00695 3.41392 6.83287L2.74106 7.50239C2.62054 7.61956 2.4699 7.68316 2.29583 7.68316C2.12845 7.68316 1.97111 7.61621 1.85059 7.49904C1.73343 7.37853 1.66648 7.22119 1.66982 7.05381C1.66982 6.88643 1.73343 6.7291 1.85394 6.60858L2.34604 6.11983L1.87403 5.64447L1.38193 6.13322C1.13421 6.3776 1.0003 6.70566 1.0003 7.05047Z" fill="#292929"/>
</svg>
`,
      icon: "assests/image/quick_icons/Emer3.png",
      type: 1,
    },
    {
      id: "10",
      text: "There is a baby or pet in the car",
      svgicon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="20" height="20" fill="white"/>
<path d="M10.2721 6.17888C11.7022 6.17888 12.8615 5.01955 12.8615 3.58944C12.8615 2.15933 11.7022 1 10.2721 1C8.84195 1 7.68262 2.15933 7.68262 3.58944C7.68262 5.01955 8.84195 6.17888 10.2721 6.17888Z" fill="#292929"/>
<path d="M6.219 14.0968C5.81905 14.4458 5.6931 15.0097 5.90646 15.4949L7.12534 18.275C7.32409 18.7291 7.76892 18.9999 8.23521 18.9999C8.39711 18.9999 8.56211 18.967 8.72038 18.8978C9.3328 18.6294 9.61211 17.9148 9.34366 17.3023L8.48155 15.3361L9.42823 14.509L7.55284 12.9315L6.219 14.0968Z" fill="#292929"/>
<path d="M12.0611 15.3362L11.1995 17.3024C10.9306 17.915 11.2099 18.629 11.8228 18.898C11.981 18.9673 12.1461 19 12.3085 19C12.7748 19 13.2191 18.7292 13.4184 18.2746L14.6371 15.4954C14.8497 15.0094 14.7239 14.4458 14.325 14.0964L12.991 12.9313L11.115 14.5092L12.0611 15.3362Z" fill="#292929"/>
<path d="M16.2634 10.5388L12.6694 7.23209C12.6249 7.19123 12.5769 7.15592 12.5269 7.12605C12.3901 6.99338 12.2041 6.91101 11.9984 6.91101H8.54569C8.33892 6.91101 8.15207 6.99403 8.01487 7.12761C7.96573 7.15722 7.91879 7.19226 7.87483 7.23261L4.27948 10.5388C3.92776 10.8626 3.90487 11.4095 4.22866 11.7616C4.39884 11.9469 4.63159 12.0409 4.865 12.0409C5.07474 12.0409 5.28474 11.9654 5.4509 11.8124L7.78379 9.66674V11.7153H12.7593V9.66623L15.0919 11.8124C15.2583 11.9652 15.4683 12.0409 15.6774 12.0409C15.9108 12.0409 16.1442 11.9469 16.3147 11.7612C16.6381 11.4093 16.6156 10.8621 16.2634 10.5388Z" fill="#292929"/>
</svg>
`,
      icon: "assests/image/quick_icons/Emer4.png",
      type: 1,
    },
    {
      id: "11",
      text: "Window of the car is open",
      svgicon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="20" height="20" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M1 5C1 4.44772 1.44772 4 2 4H6.29236C6.68852 4 7.07574 4.11764 7.40494 4.33802L18.1126 11.5059C18.6671 11.8772 19 12.5006 19 13.1679V15C19 15.5523 18.5523 16 18 16H2C1.44772 16 1 15.5523 1 15V5ZM8.74706 12.5721L5.37588 10.2916C5.27014 10.2201 5.2049 10.1024 5.20026 9.97478C5.19564 9.84722 5.25218 9.72508 5.35246 9.64608L8.65244 7.04608L9.14754 7.67448L6.27754 9.9357L9.19442 11.9089L9.32364 11.7173C9.36658 11.6536 9.4623 11.6601 9.49624 11.729L10.0552 12.8631C10.0894 12.9324 10.0352 13.0127 9.95812 13.007L8.69724 12.9136C8.62064 12.9079 8.57878 12.8216 8.62172 12.7579L8.74706 12.5721Z" fill="#292929"/>
</svg>
`,
      icon: "assests/image/quick_icons/sticker1.svg",
      type: 1,
    },
    // bike sms
    {
      id: "5",
      text: "The bike is getting towed",
      icon: "assests/image/quick_icons/random_icon_3.svg",
      type: 2,
    },
    {
      id: "7",
      text: "The bike is in no parking zone",
      icon: "assests/image/quick_icons/random_icon_2.svg",
      type: 2,
    },
    {
      id: "8",
      text: "You forgot your keys in the bike",
      icon: "assests/image/quick_icons/key-chain.png",
      type: 2,
    },
    {
      id: "1",
      text: "The storage compartment of the bike is open",
      icon: "assests/image/quick_icons/box.png",
      type: 2,
    },
  ];

  // Effect to load initial values from localStorage and listen for dynamic updates
  useEffect(() => {
    const storedVehiclePlateNumber = localStorage.getItem("vehiclePlateNumber");
    const storedProductId = localStorage.getItem("productid"); // Fetch productid from local storage
    const storedBloodGroup = localStorage.getItem("strBloodGroup");

    if (storedVehiclePlateNumber)
      setVehiclePlateNumber(storedVehiclePlateNumber);
    if (storedBloodGroup) setBloodGroup(storedBloodGroup);

    // Filter messages based on productid
    if (storedProductId) {
      const filtered = staticMessages.filter(
        (message) => message.type === parseInt(storedProductId)
      );
      setFilteredMessages(filtered);
    }

    const handleStorageChange = () => {
      const updatedBloodGroup = localStorage.getItem("strBloodGroup");
      const updatedVehiclePlateNumber =
        localStorage.getItem("vehiclePlateNumber");
      const updatedProductId = localStorage.getItem("productid");

      if (updatedBloodGroup) setBloodGroup(updatedBloodGroup);
      if (updatedVehiclePlateNumber)
        setVehiclePlateNumber(updatedVehiclePlateNumber);
      if (updatedProductId) {
        const filtered = staticMessages.filter(
          (message) => message.type === parseInt(updatedProductId)
        );
        setFilteredMessages(filtered);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Function to handle sending the message
  const handleSendMessage = async () => {
    const guid = localStorage.getItem("GUID");
    if (!guid || !selectedMessageId) {
      toast.error("Please select a message first.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const url = `${apiUrl}/sms/template`;
    const params = {
      GUID: guid,
      id: selectedMessageId,
    };

    try {
      const response = await axios.post(url, params);
      if (
        response.data.ErrorCode === "0" &&
        response.data.Status === "Success"
      ) {
        toast.success("Message sent successfully!", {
          position: "top-center",
          autoClose: 2000, // Close after 2 seconds
          onClose: () => navigate("/thank-you-final"),
        });
      } else {
        toast.error("Failed to send message: " + response.data.Message, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("An error occurred while sending the message.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  // Function to handle showing the popup
  const handleCallButtonClick = () => {
    setShowPopup(true);
  };

  // Function to handle closing the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Function to handle dialing the number
  const handleDialNow = async () => {
    const guid = localStorage.getItem("GUID");
    if (!guid || !phoneNumber) {
      toast.error("Please enter a valid phone number.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const url = `${apiUrl}/make-call`;
    const params = {
      GUID: guid,
      from: phoneNumber,
    };

    try {
      const response = await axios.post(url, params);
      if (
        response.data.ErrorCode === "0" &&
        response.data.Status === "Success"
      ) {
        toast.success("Call initiated successfully!", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/"),
        });
      } else {
        toast.success("Call initiated successfully!", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/"),
        });
      }
    } catch (error) {
      console.error("Error making the call:", error);
      toast.error(
        "Call cannot be made as the recipient's number is blocked by TRAI NDNC regulations.",
        {
          position: "top-center",
          autoClose: 4000,
        }
      );
    } finally {
      closePopup();
    }
  };
  // emergency contact number api
  // Function to handle showing the popup
  const handleCallButtonClickEmergency = () => {
    setShowPopup(true);
  };

  // Function to handle closing the popup
  const closePopupEmegency = () => {
    setShowPopup(false);
  };

  // Function to handle dialing the number
  const handleDialNowEmergency = async () => {
    const guid = localStorage.getItem("GUID");
    if (!guid || !phoneNumber) {
      toast.error("Please enter a valid phone number.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const url = `{apiUrl}/emergency-call`;
    const params = {
      GUID: guid,
      from: phoneNumber,
    };

    try {
      const response = await axios.post(url, params);
      if (
        response.data.ErrorCode === "0" &&
        response.data.Status === "Success"
      ) {
        toast.success("Call initiated successfully!", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/"),
        });
      } else {
        toast.success("Call initiated successfully!", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/"),
        });
      }
    } catch (error) {
      console.error("Error making the call:", error);
      toast.error(
        "Call cannot be made as the recipient's number is blocked by TRAI NDNC regulations.",
        {
          position: "top-center",
          autoClose: 4000,
        }
      );
    } finally {
      closePopupEmegency();
    }
  };
  return (
    <>
      <ToastContainer />
      <header className="header-container d-flex justify-content-between align-items-center mb-2">
        <img
          src={logoImg}
          alt="Logo"
          className="logo-img mobile-logo"
          style={{ height: "60px", paddingLeft: "17px", width: "175px" }}
        />
        <img src={quickContactImg} alt="Quick Contact" className="quick-img" />
      </header>
      <div
        className="container mt-4 p-3"
        style={{ paddingLeft: "0", paddingRight: "0" }}
      >
        <div className="box-1 mb-4 border rounded shadow">
          <h5
            className="bg-dark text-white p-3 mb-3 fs-20"
            style={{ borderRadius: "5px 5px 0px 0px" }}
          >
            Contact Vehicle Owner
          </h5>
          <div className="d-flex justify-content-between">
            <div
              className="d-flex flex-column"
              style={{ padding: "0px 10px 20px 10px" }}
            >
              <label htmlFor="vehicle-plate" className="fs-13">
                Vehicle License Plate Number:{" "}
                <span className="text-danger">*</span>
              </label>
              <span
                className="fs-16"
                style={{ fontSize: "20px", color: "#EF4F5F" }}
              >
                {vehiclePlateNumber || "N/A"}
              </span>
            </div>
            <div
              className="d-flex flex-column"
              style={{ padding: "0px 10px 20px 10px" }}
            >
              <label htmlFor="blood-group" className="fs-13">
                Blood Group: <span className="text-danger">*</span>
              </label>
              <div className="d-flex align-items-center justify-content-center">
                <img
                  src="assests/image/Layer 2.svg"
                  alt="Blood Picture"
                  className="sm-pic"
                  style={{ width: "30px", height: "30px", marginRight: "10px" }}
                />
                <span style={{ fontSize: "20px", color: "#EF4F5F" }}>
                  {bloodGroup || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="box-2 mb-4 p-3 border rounded shadow"
          style={{ borderRadius: "15px" }}
        >
          <h6 className="mb-3">
            Please select a message to contact owner of the vehicle
          </h6>
          <div className="d-flex flex-column">
            {filteredMessages.map((message, svgicon) => (
              <div className="d-flex align-items-center mb-2" key={message.id}>
                <img
                  src={message.icon}
                  alt="Icon"
                  style={{
                    color: "black !important",
                    marginRight: "10px",
                    width: "30px",
                  }}
                />
                <div>
                  <div
                    style={{
                      color:
                        selectedMessageId === message.id ? "red" : "yellow", // Change color when selected
                    }}
                    dangerouslySetInnerHTML={{
                      __html: message.svgicon
                        ? message.svgicon.replace(
                            /fill="#292929"/g, // Replace the default color in the SVG
                            `fill="${
                              selectedMessageId === message.id
                                ? "#ef4f5f"
                                : "#000"
                            }"` // Set the color based on selection
                          )
                        : "", // If svgicon is undefined, fallback to an empty string
                    }}
                  />
                </div>

                <div
                  className={`flex-grow-1 message-text ${
                    selectedMessageId === message.id ? "selected" : ""
                  }`}
                  style={{
                    fontWeight: 500,
                    color: selectedMessageId === message.id ? "#000" : "#000",
                  }}
                >
                  {message.text}
                </div>

                <input
                  className="form-check-input custom-radio"
                  type="radio"
                  name="option"
                  id={`option_${message.id}`}
                  onChange={() => setSelectedMessageId(message.id)}
                />
                <label htmlFor={`option_${message.id}`}></label>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn_emergency d-flex align-items-center"
              style={{
                width: "9em",
                color: "#292929",
                border: "2px solid #292929",
                marginLeft: "0px",
              }}
              onClick={handleSendMessage}
            >
              <i className="fas fa-envelope me-2"></i>
              Message
            </button>
            <button
              className="btn_emergency d-flex align-items-center"
              style={{
                width: "9em",
                color: "#292929",
                border: "2px solid #292929",
                marginRight: "0px",
              }}
              onClick={handleCallButtonClick}
            >
              <i className="fas fa-phone me-2"></i>
              Call
            </button>
          </div>
          {error && <p className="text-danger">{error}</p>}{" "}
        </div>

        <div className="text-center mb-4">
          <div
            className="bg-dark text-white"
            style={{
              borderRadius: "32px",
              maxWidth: "30em",
              margin: "0 auto",
              border: "2px solid #ddd",
              padding: "3px",
            }}
          >
            <div className="d-flex align-items-center">
              <div
                className="bg-white lock_icon"
                style={{
                  borderRadius: "50%",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src="/assests/image/call-lock-icon.svg"
                  alt="privacy icon"
                />
              </div>
              <h5
                className="ms-3 mb-0 fs-13"
                style={{ fontSize: "16px", textAlign: "center" }}
              >
                The privacy of all callers will be protected
              </h5>
            </div>
          </div>
        </div>

        <div className="text-center mb-4">
          <button
            className="btn_emergency"
            onClick={handleCallButtonClickEmergency}
          >
            <img
              src="/assests/image/emergency_img.png"
              alt="Emergency Icon"
              className="me-2"
              style={{ width: "24px", height: "24px" }}
            />
            Emergency Contact Number
          </button>
        </div>

        <div className="text-center mb-4">
          <h5>
            {" "}
            Require QR Genie?{" "}
            <NavLink
              to="/productdetail"
              style={{
                color: "#EF4F5F",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Buy Now
            </NavLink>
          </h5>
        </div>
      </div>

      {/* Popup for the call confirmation */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePopup}>
              &times;
            </button>

            <div className="message-box">
              <p className="popup-message">
                To set up a <span className="txt-main">MASKED</span> call
                between <br /> you and the tag owner, we will need <br /> your
                phone number.
              </p>
            </div>
            <input
              type="text"
              maxLength="10"
              placeholder="Please enter your phone number"
              className="phone-input"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 10) {
                  setPhoneNumber(value);
                }
              }}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ced4da",
                margin: "10px 0",
              }}
            />
            <button onClick={handleDialNow} className="new-btn-d">
              <i class="fas fa-phone"></i> Call
            </button>
            <p className="pv-txt">
              *The privacy of all callers will be protected.
            </p>
          </div>
        </div>
      )}

      {/* Emergency Contact Number*/}

      {showPopup && (
        <div className="popup-overlay" onClick={closePopupEmegency}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePopupEmegency}>
              &times;
            </button>

            <div className="message-box">
              <p className="popup-message">
                To set up a <span className="txt-main">MASKED</span> call
                between <br /> you and the tag owner, we will need <br /> your
                phone number.
              </p>
            </div>
            <input
              type="text"
              maxLength="10"
              placeholder="Please enter your phone number"
              className="phone-input"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 10) {
                  setPhoneNumber(value);
                }
              }}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ced4da",
                margin: "10px 0",
              }}
            />
            <button onClick={handleDialNow} className="new-btn-d">
              <i class="fas fa-phone"></i> Call
            </button>
            <p className="pv-txt">
              You should receive a call from our system which will connect to
              the vehicle owner.
            </p>
            <p className="pv-txt">
              *The privacy of all callers will be protected.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default QuickContact;
