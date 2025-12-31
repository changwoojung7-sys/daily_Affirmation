const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const button = document.getElementById('new-quote-btn');

async function fetchAIQuote() {
    // 1. 요청 시작: 버튼 비활성화 및 로딩 표시
    button.disabled = true;
    quoteText.style.opacity = 0.3;
    quoteText.innerText = "당신을 위한 문장을 짓고 있습니다...";

    try {
        // 2. API 호출
        const response = await fetch('/api/dailyai');
        const data = await response.json();

        // 3. 텍스트 교체 전 요소를 완전히 숨김
        quoteText.style.opacity = 0;
        authorText.style.opacity = 0;

        // 4. 숨겨진 상태에서 텍스트를 교체하고 다시 나타나게 함 (0.5초 대기)
        setTimeout(() => {
          let formattedText = data.text;
          
          // 문장이 비정상적으로 끊겼는지 확인 (마지막 글자가 마침표 계열이 아닐 때)
          if (!/[.!?]$/.test(formattedText)) {
              formattedText += '.';
          }

          quoteText.innerText = `"${formattedText}"`;
          authorText.innerText = `- ${data.author} -`;
          
          quoteText.style.opacity = 1;
          authorText.style.opacity = 1;
          button.disabled = false;
          
          // 페이드 인 효과 재적용
          quoteText.classList.remove('fade-in');
          void quoteText.offsetWidth; 
          quoteText.classList.add('fade-in');
        }, 500);

    } catch (error) {
        // 에러 발생 시 처리
        quoteText.innerText = "잠시 연결이 원활하지 않습니다.";
        quoteText.style.opacity = 1;
        button.disabled = false;
        console.error("Fetch Error:", error);
    }
}

// 이벤트 리스너 등록
button.addEventListener('click', fetchAIQuote);

// 페이지 로드 시 첫 문장 자동 호출
window.onload = fetchAIQuote;