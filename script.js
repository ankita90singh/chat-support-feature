const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const chatBottoggler = document.querySelector(".chatbot-toggler");
const chatBotclosebtn = document.querySelector(".close-btn ");


let userMessage;
const API_KEY = "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";
const inputHeight = chatInput.scrollHeight;


const createChatLi = (message, className) => {
    //create a chat <li> element with passed message and classname
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : ` <span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) =>{
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement =incomingChatLi.querySelector("p")


    const requestOptions = {
        method: "POST",
        headers: {
            "content-Type": "application/json",
            "Authorization":`Bearer ${API_KEY}`

        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}]
        })
    }
    //send post request to api
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        console.log(data)
      messageElement.textContent = data.choices[0].message.content;
        

    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oop's! sonthing wents wrong please try again.";
        
    }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight))
}
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputHeight}px`;

//append the users message to the chatbox
    chatBox.appendChild(createChatLi(userMessage, "outgoing"))
    chatBox.scroll(0,chatBox.scrollHeight)

    setTimeout(() =>{
        //diplay typing... message while waiting for your answer
        const incomingChatLi = createChatLi("typing....", "incoming")
        chatBox.appendChild(incomingChatLi)
        chatBox.scroll(0,chatBox.scrollHeight)
        generateResponse(incomingChatLi);
    },600);
}
chatInput.addEventListener("input",function(){
    //adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown",function(e){
    //if the entered key is pressed without shift key and the window width is greater then 800px ,handle the chat
    if(e.key=== "Enter" && !e.shiftKey && window.innerWidth >800){
        e.preventDefault();
        handleChat();
    }
})

sendChatBtn.addEventListener("click",handleChat)
chatBotclosebtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"))
chatBottoggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"))