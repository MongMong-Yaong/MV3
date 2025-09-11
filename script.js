if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {
                console.log(
                    "Service Worker registered with scope:",
                    registration.scope
                );
            })
            .catch((error) => {
                console.error("Service Worker registration failed:", error);
            });
    });
}

document.addEventListener("mousedown", (e) => {
    // 클릭한 요소가 input 또는 textarea면 무시
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    // 선택 영역 제거
    window.getSelection().removeAllRanges();
});


window.addEventListener("DOMContentLoaded", () => {
    const splash = document.getElementById("splash");
    const loginCard = document.getElementById("loginCard");

    // splash가 나타나는 동안 미리 로그인 상태 확인 및 준비
    const savedUserName = localStorage.getItem("vitaOrdoUserName");

    if (savedUserName) {
        // 로그인된 상태 - 앱 초기화 준비
        setTimeout(() => {
            try {
                attendanceChecker = new AttendanceChecker(savedUserName);
                window.attendanceChecker = attendanceChecker;
                console.log("AttendanceChecker initialized successfully");
            } catch (error) {
                console.error("Initialization error:", error);
            }
        }, 100);
    } else {
        // 로그인되지 않은 상태 - 로그인 카드를 splash 뒤에 미리 표시
        loginCard.style.display = "flex";
        // 로그인 이벤트 설정
        setupLoginEvents();
    }

    setTimeout(() => {
        splash.classList.add("fade-out");

        setTimeout(() => {
            splash.style.display = "none";
            // splash가 끝나면 추가 작업 불필요 (이미 준비완료)
        }, 500); // transition 시간과 동일
    }, 1000); // 첫 등장 후 약간 기다렸다가 사라지게
});

// 로그인 이벤트 설정 함수 추가
function setupLoginEvents() {
    const loginInput = document.getElementById("loginNameInput");
    const loginBtn = document.getElementById("loginBtn");

    loginInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    });

    loginBtn.addEventListener("click", handleLogin);
}

// 로그인 처리
function handleLogin() {
    const nameInput = document.getElementById("loginNameInput");
    const name = nameInput.value.trim();

    if (!name) {
        // 간단한 에러 표시 (토스트 시스템이 아직 초기화되지 않았으므로)
        nameInput.style.borderColor = "rgba(248, 81, 73, 0.8)";
        nameInput.placeholder = "이름을 입력해주세요";
        setTimeout(() => {
            nameInput.style.borderColor = "";
            nameInput.placeholder = "이름을 입력하세요";
        }, 2000);
        return;
    }

    // 이름 저장
    localStorage.setItem("vitaOrdoUserName", name);

    // 1단계: login-content 먼저 fade-out
    const loginContent = document.querySelector(".login-content");
    loginContent.style.opacity = "0";

    setTimeout(() => {
        // 이 사이에 앱 초기화 (로그인 처리)
        showApp(name);

        // 2단계: 1초 후 loginCard 배경 fade-out
        setTimeout(() => {
            const loginCard = document.getElementById("loginCard");
            loginCard.style.opacity = "0";

            setTimeout(() => {
                loginCard.style.display = "none";
                // 원래 opacity 복원 (다음 로그인을 위해)
                loginCard.style.opacity = "1";
                loginContent.style.opacity = "1";
            }, 500); // loginCard fade-out 시간
        }, 1000); // 1초 대기
    }, 300); // login-content fade-out 시간
}

// 로그인 카드 숨기기
function hideLoginCard() {
    const loginCard = document.getElementById("loginCard");
    loginCard.style.opacity = "0";

    setTimeout(() => {
        loginCard.style.display = "none";

        // 로그인 카드가 사라진 후 1초 뒤에 검은 배경도 fade-out
        setTimeout(() => {
            const loginCardBackground = document.querySelector(".login-card");
            if (loginCardBackground && loginCardBackground.style.display !== "none") {
                loginCardBackground.style.opacity = "0";

                setTimeout(() => {
                    loginCardBackground.style.display = "none";
                }, 500); // fade-out 시간
            }
        }, 1000); // 1초 대기
    }, 300);
}

// 앱 시작
function showApp(userName) {
    // 이미 초기화되어 있다면 추가 작업 불필요
    if (
        window.attendanceChecker &&
        window.attendanceChecker.userName === userName
    ) {
        return;
    }

    // AttendanceChecker 초기화 및 시작
    setTimeout(() => {
        try {
            attendanceChecker = new AttendanceChecker(userName);
            window.attendanceChecker = attendanceChecker;
            console.log("AttendanceChecker initialized successfully");
        } catch (error) {
            console.error("Initialization error:", error);
        }
    }, 100);
}

class LunarCalendar {
    constructor() {
        this.lunarInfo = [
            0x04bd8,
            0x04ae0,
            0x0a570,
            0x054d5,
            0x0d260,
            0x0d950,
            0x16554,
            0x056a0,
            0x09ad0,
            0x055d2, //1900-1909
            0x04ae0,
            0x0a5b6,
            0x0a4d0,
            0x0d250,
            0x1d255,
            0x0b540,
            0x0d6a0,
            0x0ada2,
            0x095b0,
            0x14977, //1910-1919
            0x04970,
            0x0a4b0,
            0x0b4b5,
            0x06a50,
            0x06d40,
            0x1ab54,
            0x02b60,
            0x09570,
            0x052f2,
            0x04970, //1920-1929
            0x06566,
            0x0d4a0,
            0x0ea50,
            0x16a95,
            0x05ad0,
            0x02b60,
            0x186e3,
            0x092e0,
            0x1c8d7,
            0x0c950, //1930-1939
            0x0d4a0,
            0x1d8a6,
            0x0b550,
            0x056a0,
            0x1a5b4,
            0x025d0,
            0x092d0,
            0x0d2b2,
            0x0a950,
            0x0b557, //1940-1949
            0x06ca0,
            0x0b550,
            0x15355,
            0x04da0,
            0x0a5b0,
            0x14573,
            0x052b0,
            0x0a9a8,
            0x0e950,
            0x06aa0, //1950-1959
            0x0aea6,
            0x0ab50,
            0x04b60,
            0x0aae4,
            0x0a570,
            0x05260,
            0x0f263,
            0x0d950,
            0x05b57,
            0x056a0, //1960-1969
            0x096d0,
            0x04dd5,
            0x04ad0,
            0x0a4d0,
            0x0d4d4,
            0x0d250,
            0x0d558,
            0x0b540,
            0x0b6a0,
            0x195a6, //1970-1979
            0x095b0,
            0x049b0,
            0x0a974,
            0x0a4b0,
            0x0b27a,
            0x06a50,
            0x06d40,
            0x0af46,
            0x0ab60,
            0x09570, //1980-1989
            0x04af5,
            0x04970,
            0x064b0,
            0x074a3,
            0x0ea50,
            0x06b58,
            0x05ac0,
            0x0ab60,
            0x096d5,
            0x092e0, //1990-1999
            0x0c960,
            0x0d954,
            0x0d4a0,
            0x0da50,
            0x07552,
            0x056a0,
            0x0abb7,
            0x025d0,
            0x092d0,
            0x0cab5, //2000-2009
            0x0a950,
            0x0b4a0,
            0x0baa4,
            0x0ad50,
            0x055d9,
            0x04ba0,
            0x0a5b0,
            0x15176,
            0x052b0,
            0x0a930, //2010-2019
            0x07954,
            0x06aa0,
            0x0ad50,
            0x05b52,
            0x04b60,
            0x0a6e6,
            0x0a4e0,
            0x0d260,
            0x0ea65,
            0x0d530, //2020-2029
            0x05aa0,
            0x076a3,
            0x096d0,
            0x04afb,
            0x04ad0,
            0x0a4d0,
            0x1d0b6,
            0x0d250,
            0x0d520,
            0x0dd45, //2030-2039
            0x0b5a0,
            0x056d0,
            0x055b2,
            0x049b0,
            0x0a577,
            0x0a4b0,
            0x0aa50,
            0x1b255,
            0x06d20,
            0x0ada0, //2040-2049
            0x14b63,
            0x09370,
            0x049f8,
            0x04970,
            0x064b0,
            0x168a6,
            0x0ea50,
            0x06aa0,
            0x1a6c4,
            0x0aae0, //2050-2059
        ];
    }

    lYearDays(y) {
        let i,
            sum = 348;
        for (i = 0x8000; i > 0x8; i >>= 1) {
            sum += this.lunarInfo[y - 1900] & i ? 1 : 0;
        }
        return sum + this.leapDays(y);
    }

    leapDays(y) {
        if (this.leapMonth(y)) {
            return this.lunarInfo[y - 1900] & 0x10000 ? 30 : 29;
        }
        return 0;
    }

    leapMonth(y) {
        return this.lunarInfo[y - 1900] & 0xf;
    }

    lMonthDays(y, m) {
        if (m === 0) return 0;
        return this.lunarInfo[y - 1900] & (0x10000 >> m) ? 30 : 29;
    }

    solarToLunar(y, m, d) {
        if (y < 1960 || y > 2050) {
            return null; // 1960년 이전, 2050년 이후는 null 반환
        }
        let offset = (Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 31)) / 86400000;
        let i,
            temp = 0;
        for (i = 1900; i < 2051 && offset > 0; i++) {
            temp = this.lYearDays(i);
            offset -= temp;
        }
        if (offset < 0) {
            offset += temp;
            i--;
        }
        let year = i;
        let leap = this.leapMonth(i);
        let isLeap = false;
        for (i = 1; i < 13 && offset > 0; i++) {
            if (leap > 0 && i === leap + 1 && isLeap === false) {
                --i;
                isLeap = true;
                temp = this.leapDays(year);
            } else {
                temp = this.lMonthDays(year, i);
            }
            if (isLeap === true && i === leap + 1) isLeap = false;
            offset -= temp;
        }
        if (offset === 0 && leap > 0 && i === leap + 1) {
            if (isLeap) {
                isLeap = false;
            } else {
                isLeap = true;
                --i;
            }
        }
        if (offset < 0) {
            offset += temp;
            --i;
        }
        return {
            year: year,
            month: i,
            day: offset + 1,
            isLeapMonth: isLeap,
        };
    }

    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 1);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    }

    formatLunar(lunarDate) {
        if (!lunarDate) {
            return ""; // null일 경우 빈 문자열 반환
        }
        return `${lunarDate.month}.${lunarDate.day}${
      lunarDate.isLeapMonth ? " (윤)" : ""
    }`;
    }

    // formatLunar 함수 다음에 이 함수를 추가하세요
    lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeapMonth = false) {
        if (lunarYear < 1960 || lunarYear > 2050) {
            return null;
        }

        let offset = 0;
        let tempYear = 1900;

        // 1900년부터 해당 연도 전까지의 총 일수 계산
        for (tempYear = 1900; tempYear < lunarYear; tempYear++) {
            offset += this.lYearDays(tempYear);
        }

        // 해당 연도에서 해당 월까지의 일수 계산
        let tempMonth = 1;
        let leap = this.leapMonth(lunarYear);
        let isLeap = false;

        for (tempMonth = 1; tempMonth < lunarMonth; tempMonth++) {
            offset += this.lMonthDays(lunarYear, tempMonth);
        }

        // 윤달 처리
        if (leap > 0 && lunarMonth > leap) {
            offset += this.leapDays(lunarYear);
        }

        if (leap > 0 && lunarMonth == leap + 1 && isLeapMonth) {
            offset += this.lMonthDays(lunarYear, lunarMonth - 1);
        }

        // 해당 월에서 해당 일까지의 일수 계산
        offset += lunarDay - 1;

        // 1900년 1월 31일부터 계산된 일수만큼 더함
        const baseDate = new Date(1900, 0, 31);
        const resultDate = new Date(
            baseDate.getTime() + offset * 24 * 60 * 60 * 1000
        );

        return {
            year: resultDate.getFullYear(),
            month: resultDate.getMonth() + 1,
            day: resultDate.getDate(),
        };
    }
}
// 메인 클래스
class AttendanceChecker {
    constructor(userName) {
        this.userName = userName;
        this.currentYear = new Date().getFullYear();
        this.currentMonth = new Date().getMonth();
        this.currentMode = "dashboard"; // 기본 모드를 대시보드로 변경
        this.currentSelectedDate = null;
        this.currentEditingSchedule = null;
        this.currentEditingMemo = null;
        this.currentEditingCounter = null;
        this.currentEditingAttendance = null;
        this.activeTab = "todo";
        this.currentTodoEditId = null;
        this.pendingConfirmAction = null;
        this.currentViewingDate = null;

        // 메모 편집 상태 관리용 프로퍼티 추가
        this.memoEditMode = false;
        this.originalMemoData = null;

        // 음력 계산기 인스턴스
        this.lunarCalendar = new LunarCalendar();

        // 데이터 저장소
        this.attendanceData = {};
        this.attendanceLog = [];
        this.schedulesData = [];
        this.todoData = [];
        this.completedData = [];
        this.memoData = [];
        this.counterData = [];

        // 필터 상태
        this.currentScheduleFilter = null;
        this.currentTodoFilter = null;
        this.currentMemoFilter = null;
        this.currentCounterFilter = null;
        this.currentMemoSearch = "";
        this.currentScheduleSearch = "";
        this.currentScheduleTypeFilter = ""; // 새로운 필터 추가

        this.titleFonts = ["shadows-into-light-regular"];

        // 이벤트 리스너 설정
        document
            .getElementById("exportBtn")
            .addEventListener("click", () => this.exportData());
        document
            .getElementById("importBtn")
            .addEventListener("click", () =>
                document.getElementById("importFile").click()
            );
        document
            .getElementById("importFile")
            .addEventListener("change", (e) => this.importData(e));

        // 명언 배열 (기본값들)
        this.quotes = [
            '"모든 어른도 한때는 아이였다. 하지만 그걸 기억하는 어른은 많지 않다." – 어린 왕자 (1943)',
            '"희망은 좋은 것이고, 어쩌면 가장 좋은 것이다. 좋은 것은 결코 죽지 않는다." – The Shawshank Redemption (1994)',
            '"우리가 결정해야 할 것은 주어진 시간을 어떻게 쓸 것인가 뿐이다." – The Lord of the Rings: The Fellowship of the Ring (2001)',
            '"바쁘게 살아가거나, 바쁘게 죽어가거나." – The Shawshank Redemption (1994)',
            '"다른 사람의 입장에서 생각해보기 전엔 그를 결코 이해할 수 없다." – To Kill a Mockingbird (1962)',
            '"두려움은 정신을 죽인다." – Dune (1984, 2021)',
            '"승자는 상대가 어떻게 나오든 변명하지 않는다." – Suits',
            '"사실, 누구든 널 아프게 할 거다. 중요한 건 그 고통을 감당할 만한 사람을 찾는 거다." – Remember Me (2010)',
            '"겁쟁이는 죽기 전에 수없이 죽고, 용감한 자는 단 한 번만 죽는다." – Julius Caesar',
            '"우리는 반복적으로 하는 것의 총합이다. 탁월함은 행동이 아니라 습관이다." – Westworld',
            '"존경을 원해? 그럼 직접 얻어와야지." – Suits',
            '"목소리를 높이지 말고, 논리를 높여라." – Suits',
            '"취하지 않아도 즐길 줄 안다." – Suits',
            '"기억은 우리가 사랑하는 사람들을 계속 살아 있게 해." – 코코 (2017)',
            '"너 자신을 믿어야 해. 그게 네 길을 밝혀줄 거야." – 라푼젤 (2010)',
            '"진정한 용기는 두려움을 느끼면서도 나아가는 거야." – 뮬란 (1998)',
            '"두려워한다고 해서 두려움이 사라지진 않아." – 루카 (2021)',
            '"Silenzio, Bruno!" – 루카(2021)',
            '"Not everyone can become a great artist, but a great artist can come from anywhere." - 라따뚜이 (2007)',
            '"Life is like a box of chocolates, you never know what you’re gonna get." - 포레스트 검프 (1994)',
            '"Never forget how much your family loves you." - 코코 (2017)',
            '"Skadoosh!" - 쿵푸팬더 (2008)',
            '"어제는 역사고, 내일은 미스터리야. 오늘은 선물이야. 그래서 지금을 선물(present)이라고 부르는 거지." - 쿵푸팬더 (2008)',
            "“평온히 그 고운 밤 속으로 가지 마라. 늙음은 저무는 날에 타오르고 분노해야 한다. 꺼져가는 빛에 맞서 분노하라, 분노하라.” - Interstellar (2014) ",
            "“유순한 대답은 분노를 쉬게 하여도 과격한 말은 노를 격동하느니라.” - 잠언 15:1",
            '"초상집에 가는 것이 잔치집에 가는 것보다 나으니 모든 사람의 결국이 이와 같이 됨이라 산 자가 이것에 유심하리로다" - 전도서 7:2 ',
            '"네가 어디로 가든, 진짜 집은 네 마음속에 있어." - 『피터팬』 (J.M. Barrie)',
            '"네가 네 장미를 위해 보낸 시간이 네 장미를 특별하게 만드는 거야." - 어린 왕자 (1943)',
            '"사막 한가운데서도 별을 보며 웃을 수 있어." - 어린 왕자 (1943)',
            '"주변 모두가 당황하고 당신을 탓할 때에도 침착함을 유지할 수 있다면" - if (Rudyard Kipling)',
            '"모든 사람이 의심할 때에도 자신을 믿을 수 있으면서, 그들의 의심도 이해할 수 있다면" - -if-(Rudyard Kipling)',
            '"너의 죽음을 기억하라"',
            '"가장 어두운 밤에도 별은 빛나고, 가장 깊은 절망 속에도 희망은 있다." - J.R.R. 톨킨, 반지의 제왕- ',
            '"우리는 모두 서로에게 배우는 학생이자 선생이다." - 드라마 슬기로운 의사생활',
            '"너의 열정은 세상을 더 따뜻하게 만든다." - 드라마 스타트업',
            '"오늘은 어제와 다르길." – 굿 윌 헌팅 (1997) ',
            "“이 순간을 즐겨요.” – 죽은 시인의 사회 (1989)",
            "“행운을 빈다.” – 헝거 게임 (2012)",
            "“길은 걷는 자의 것.” – 반지의 제왕",
            "“이 순간은 두 번 오지 않아.” – 비포 선라이즈 (1995)",
            "“우린 모두 별의 먼지야.” – 인터스텔라 (2014)",
            "“내일은 오늘보다 나을 거야.” – 레 미제라블 (2012)",
            '"가슴이 비어 있다면, 머리는 아무 소용 없다" - 제리 맥과이어 (1997)',
            '"사소한 것들을 소중히 해야 해. 그것이 삶을 이루는 버팀목이니까." - The Simpsons',
            '"역경을 이겨내고 핀 꽃이 제일 아름다운 꽃이니라." - 뮬란 (1998)',
            '"훌륭한 요리 이전에 훌륭한 재료가 필요한 것처럼, 소중한 사람들이 삶을 맛깔나게 해준다." - 라따뚜이 (2007)',
            '"과거는 흘러갔고 어쩔 수 없는 거야. 그렇지? 그럴 땐 바로 신경 끄고 사는 게 상책이야!" - 라이온 킹 (1994)',
            '"두려움은 본능이야. 하지만 견뎌낸다면 용기를 얻게 될 거야" - 굿 다이노 (2015)',
            '"살다보면 화나는 일도 많지만, 분노를 풀어서는 안 된다. 세상엔 아름다움이 넘치니까." - 아메리칸 뷰티 (1999)',
            '"사랑하는 법을 알려줘서 고마워.또 사랑받는 법도." - 이프 온리 (2004)',
            '"사랑이 처음부터 풍덩 빠지는 줄만 알았지 이렇게 서서히 물들어 버리는 것인 줄은 몰랐다." - 미술관 옆 동물원 (1998)',
            '"세상엔 인연들만 만나는 게 아니에요. 인연이란 말은 시작할 때 하는 말이 아니라, 모든 게 끝날 때 하는 말이에요." - 동감 (2000)',
            '"어른이 된다는 것은, 계기판은 210까지 있지만 60으로밖에 달릴 수 없는 것" - 러브 미 이프 유 데어 (2003)',
            '"그들은 과정보다는 큰 성취를 원하지. 하지만 작은 변화는 작은 일의 성취가 모여서 이뤄지는 거야." - 비포 선셋 (2004)',
            '"타인보다 우수하다고 해서 고귀한 것은 아니다. 과거의 자신보다 우수한 것이야말로 진정으로 고귀한 것이다." - 킹스맨 (2014)',
            '"편견은 내가 다른 사람을 사랑하지 못하게 하고, 오만은 다른 사람이 나를 사랑할 수 없게 만든다." - 오만과 편견(2005)',
            '"그리워하는데도 한 번 만나고는 못 만나게 되기도 하고, 일생을 못 잊으면서도 아니 만나고 살기도 한다" - 피천득, 인연',
        ];

        this.welcomeMessages = [
            "반갑습니다.",
            "안녕하세요.",
            "좋은 하루입니다.",
            "오늘도 화이팅!",
            "멋진 하루 되세요.",
            "어떤 생각을 하고 계신가요?",
            "오늘도 배움과 성찰을 놓치지 않는 하루가 되길.",
            "지금 이 순간이 삶의 전부일지도 몰라요.",
            "마음의 평화를 가장 소중히 여기는 하루 되세요.",
            "비판보다 관찰할 수 있는 하루 되길.",
            "오늘 누군가에게 먼저 웃어주세요.",
            "상대방을 바꾸기보다 먼저 내 마음을 돌아보는 하루 되길.",
            "말보다 귀 기울이는 하루 되길 바랍니다.",
            "오늘 하루, 인간관계 속에서 나 자신도 배우는 하루 되길.",
            "하루에 한 번, 호흡에 집중하며 마음을 비워보세요.",
            "오늘은 장난기 가득한 하루 되세요!",
            "삶이라는 책의 또 다른 장을 열었네요!",
            "바쁜 하루를 살고 계신가요?",
            "오늘을 다시 산다면 바꾸고 싶은 게 있나요?",
            "어디서부터 시작할까요?",
            "허리를 펴세요.",
            "스트레칭 해볼까요?",
            "물 한 잔 마시고 하세요.",
            "하루를 정리해 볼까요?",
            "오늘 하루 감사할 일이 있었나요?",
            "오늘도 한 걸음씩 나아가세요.",
            "어제보다 더 나은 오늘이 되길 바랍니다.",
            "꾸준함이 답이에요.",
            "진심은 통해요.",
            "무섭다면 좋아해보세요.",
            "강강약약 외유내강.",
            "심호흡 한 번 하고 갈까요?",
            "마음가짐이 하루를 바꿔요.",
            "2초의 여유를 가지길 바랍니다.",
            "작은 성취도 기뻐할 줄 알면 좋아요!",
            "마음 한 켠에 여유를 남겨두세요.",
            "오셨군요,",
            "자세를 바르게 해 보세요.",
            "바른 자세가 정말 중요해요.",
            "감사하는 마음이 삶을 풍요롭게 해요.",
            "이것도 지나가요.",
            "생각을 바꾸면 스트레스도 줄어요.",
            "인내는 마음의 근육이에요.",
            "내 행동과 마음을 체크하는 습관이 힘이 돼요.",
            "친근해도 존중을 잊지 마세요.",
            "남을 따라가기보다 내 선택을 믿어보세요.",
            "주저하지 말고 선택하고, 수정하면 돼요.",
            "완벽을 추구하다가 놓치는 게 많아요.",
            "규칙적인 생활이 마음을 안정시켜요.",
            "지난 일에 매달리지 마세요.",
            "오늘 할 수 있는 최선을 다해보세요.",
            "호흡을 고르고 마음을 정리하세요.",
            "사랑하기를 그만두지 마세요.",
            "안전한 곳에서 벗어나세요.",
            "삶의 굴곡이 있어야 이야기가 아름다워져요.",
            "가끔은 다른 선택을 해보는 게 어때요?",
            "20년 뒤 오늘로 돌아온다면, 무엇을 할 것 같나요?",
            "밖이 보이나요?",
            "지금 날씨는 어떤가요?",
            "머리는 차갑게, 마음은 뜨겁게.",
            "잠깐 얼굴 스트레칭 해볼래요?",
            "자리에서 가볍게 스트레칭 해봐요.",
            "내일 일은 내일 생각하세요.",
            "남은 시간에 집중하세요.",
            "상대를 배려하는 건 손해가 아니에요.",
            "답은 이미 알고 있지 않나요?",
            "작은 고마움도 표현하면 좋아요.",
            "오늘 있었던 일은 오늘로 흘려보내세요.",
            "참는다는 건 잊어버리는 거에요.",
            "마음을 다스리세요.",
            "자신을 돌아보는 것을 게을리 하지 마세요.",
            "틀리는 걸 무서워하지 마세요.",
            "언제나 자기 내면에 집중하세요.",
            "지금 이 순간이 전부는 아니에요.",
            "단순함이 가장 강해요.",
            "집중해 볼까요?",
        ];

        this.init();
        this.loadData();
        this.loadRandomBackground();
        this.updateDateTime();
        this.updateDashboardClock();
        this.renderCalendar();
        this.renderAttendanceLog();
        this.updateDashboardStats();
        this.displayRandomQuote();

        this.switchMode("dashboard");

        // 1초마다 시간 업데이트
        setInterval(() => {
            this.updateDateTime();
            this.updateDashboardClock();
        }, 1000);
    }

    init() {
        this.initEventListeners();
        this.displayRandomWelcomeMessage(); // updateUserName() 대신 사용
    }

    // 사용자 이름 업데이트를 랜덤 환영 메시지 표시로 변경
    displayRandomWelcomeMessage() {
        const userNameElement = document.getElementById("userName");
        const welcomeMessageElement = document.querySelector(".welcome-message");

        if (userNameElement) {
            userNameElement.textContent = this.userName;
        }

        if (welcomeMessageElement && this.welcomeMessages.length > 0) {
            const randomIndex = Math.floor(
                Math.random() * this.welcomeMessages.length
            );
            const randomMessage = this.welcomeMessages[randomIndex];
            welcomeMessageElement.innerHTML = `${randomMessage} <span id="userName">${this.userName}</span>님.`;
        }
    }

    // 대시보드 시계 업데이트
    updateDashboardClock() {
        const clockDate = document.getElementById("clockDate");
        const clockTime = document.getElementById("clockTime");

        if (clockDate && clockTime) {
            const now = new Date();
            const weekdays = [
                "일요일",
                "월요일",
                "화요일",
                "수요일",
                "목요일",
                "금요일",
                "토요일",
            ];
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const weekday = weekdays[now.getDay()];

            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");

            clockDate.textContent = `${year}년 ${month}월 ${day}일 ${weekday}`;
            clockTime.textContent = `${hours} : ${minutes} : ${seconds}`;
        }
    }

    // 대시보드 통계 업데이트
    updateDashboardStats() {
        // 이 출석일
        const totalAttendance = Object.values(this.attendanceData).filter(
            Boolean
        ).length;
        document.getElementById("dashTotalAttendance").textContent =
            totalAttendance;

        // 오늘의 일정 개수
        const today = new Date();
        const todaySchedules = this.getSchedulesForDate(today).length;
        document.getElementById("dashTodaySchedules").textContent = todaySchedules;

        // 미완료 할 일 개수
        const pendingTodos = this.todoData.length;
        document.getElementById("dashPendingTodos").textContent = pendingTodos;

        // 이 메모 개수
        const totalMemos = this.memoData.length;
        document.getElementById("dashTotalMemos").textContent = totalMemos;

        // stat-item 클릭 이벤트 추가
        const statItems = document.querySelectorAll(".stat-item");
        statItems.forEach((item, index) => {
            // 기존 이벤트 리스너 제거
            item.replaceWith(item.cloneNode(true));
        });

        // 새로운 이벤트 리스너 추가
        const newStatItems = document.querySelectorAll(".stat-item");
        newStatItems.forEach((item, index) => {
            item.style.cursor = "pointer";
            item.addEventListener("click", () => {
                switch (index) {
                    case 0: // 출석
                        this.switchMode("attendance");
                        break;
                    case 1: // 일정
                        this.switchMode("schedule");
                        break;
                    case 2: // 할 일
                        this.switchMode("todo");
                        break;
                    case 3: // 메모
                        this.switchMode("memo");
                        break;
                }
            });
        });
    }

    // 랜덤 명언 표시
    displayRandomQuote() {
        const quoteElement = document.getElementById("quoteContent");
        if (quoteElement && this.quotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.quotes.length);
            quoteElement.textContent = this.quotes[randomIndex];
        }
    }

    // 로그아웃 처리
    logout() {
        localStorage.removeItem("vitaOrdoUserName");
        location.reload(); // 페이지 새로고침으로 로그인 화면으로 돌아감
    }

    // 토스트 알림 시스템
    showToast(message, type = "info") {
        // 기존 토스트가 있다면 제거
        const existingToast = document.querySelector(".toast-notification");
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement("div");
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // 애니메이션 트리거
        setTimeout(() => {
            toast.classList.add("show");
        }, 10);

        // 1.5초 후 제거
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 1500);
    }

    // 일정의 유효한 날짜들을 미리 계산하는 함수
    calculateValidScheduleDates(schedule) {
        const validDates = [];
        const startDate = new Date(schedule.startDate + "T00:00:00");
        const endDate = new Date(schedule.endDate + "T00:00:00");

        if (schedule.annualRepeat || schedule.isImportant) {
            let years = [];
            if (schedule.annualRepeat) {
                for (let year = 1960; year <= 2050; year++) {
                    years.push(year);
                }
            } else {
                years = [startDate.getFullYear()];
            }

            years.forEach(year => {
                let targetMonth = startDate.getMonth() + 1;
                let targetDay = startDate.getDate();

                if (schedule.isLunar) {
                    const originalLunar = this.lunarCalendar.solarToLunar(
                        startDate.getFullYear(),
                        targetMonth,
                        targetDay
                    );
                    if (originalLunar) {
                        const solarDate = this.lunarCalendar.lunarToSolar(
                            year,
                            originalLunar.month,
                            originalLunar.day,
                            originalLunar.isLeapMonth
                        );
                        if (solarDate) {
                            const dateKey = this.formatDateKey(
                                solarDate.year,
                                solarDate.month,
                                solarDate.day
                            );
                            if (!validDates.includes(dateKey)) {
                                validDates.push(dateKey);
                            }
                        }
                    }
                } else {
                    const dateKey = this.formatDateKey(
                        year,
                        targetMonth,
                        targetDay
                    );
                    if (!validDates.includes(dateKey)) {
                        validDates.push(dateKey);
                    }
                }
            });
            return validDates.sort();
        }

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            if (schedule.skipWeekends) {
                const dayOfWeek = currentDate.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    validDates.push(this.getDateKey(currentDate));
                }
            } else {
                validDates.push(this.getDateKey(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return validDates.sort();
    }

    // 날짜 키 포맷팅 헬퍼 함수
    formatDateKey(year, month, day) {
        const monthStr = String(month).padStart(2, "0");
        const dayStr = String(day).padStart(2, "0");
        return `${year}-${monthStr}-${dayStr}`;
    }

    // 일정의 특정 날짜가 몇 번째인지 찾는 함수
    getScheduleDateIndex(schedule, targetDate) {
        if (!schedule.validDates) {
            schedule.validDates = this.calculateValidScheduleDates(schedule);
        }

        const targetDateStr = this.getDateKey(targetDate);
        const index = schedule.validDates.indexOf(targetDateStr);

        return {
            currentIndex: index + 1, // 1부터 시작
            totalCount: schedule.validDates.length,
            isValid: index !== -1,
        };
    }

    // 일정 편집 모달 시스템
    showScheduleEditModal(schedule) {
        const modal = document.getElementById("scheduleEditModal");
        const titleInput = document.getElementById("scheduleEditTitle");
        const contentInput = document.getElementById("scheduleEditContentText");
        const startDateInput = document.getElementById("scheduleEditStartDate");
        const endDateInput = document.getElementById("scheduleEditEndDate");
        const skipWeekendsInput = document.getElementById(
            "scheduleEditSkipWeekends"
        );
        const isHolidayInput = document.getElementById("scheduleEditIsHoliday");
        const isImportantInput = document.getElementById("scheduleEditIsImportant");
        const isLunarInput = document.getElementById("scheduleEditIsLunar");
        const annualRepeatInput = document.getElementById("scheduleEditAnnualRepeat"); // 새로 추가된 체크박스

        this.currentEditingSchedule = schedule.id;

        titleInput.value = schedule.title;
        contentInput.value = schedule.content || "";
        startDateInput.value = schedule.startDate;
        endDateInput.value = schedule.endDate;
        skipWeekendsInput.checked = schedule.skipWeekends || false;
        isHolidayInput.checked = schedule.isHoliday || false;
        isImportantInput.checked = schedule.isImportant || false;
        isLunarInput.checked = schedule.isLunar || false;
        annualRepeatInput.checked = schedule.annualRepeat || false; // 새로 추가된 체크박스 설정

        // 과거 날짜도 선택 가능하도록 min 제거
        startDateInput.removeAttribute("min");
        endDateInput.removeAttribute("min");

        // 종료일이 시작일보다 빠를 수 없도록 설정
        startDateInput.addEventListener("change", () => {
            endDateInput.min = startDateInput.value;
            if (endDateInput.value < startDateInput.value) {
                endDateInput.value = startDateInput.value;
            }
        });

        modal.style.display = "flex";
        titleInput.focus();
    }

    hideScheduleEditModal() {
            document.getElementById("scheduleEditModal").style.display = "none";
            this.currentEditingSchedule = null;
            if (this.currentMode === "schedule") {
                this.renderMonthlyCalendar();
            }
        }
        // confirmScheduleEdit 함수 수정 (한국 표준시 사용)
    confirmScheduleEdit() {
        if (!this.currentEditingSchedule) return;

        const schedule = this.schedulesData.find(
            (s) => s.id === this.currentEditingSchedule
        );
        if (!schedule) return;

        const titleInput = document.getElementById("scheduleEditTitle");
        const contentInput = document.getElementById("scheduleEditContentText");
        const startDateInput = document.getElementById("scheduleEditStartDate");
        const endDateInput = document.getElementById("scheduleEditEndDate");
        const skipWeekendsInput = document.getElementById(
            "scheduleEditSkipWeekends"
        );
        const isHolidayInput = document.getElementById("scheduleEditIsHoliday");
        const isImportantInput = document.getElementById("scheduleEditIsImportant");
        const isLunarInput = document.getElementById("scheduleEditIsLunar");
        const annualRepeatInput = document.getElementById("scheduleEditAnnualRepeat"); // 새로 추가된 체크박스

        const title = titleInput.value.trim();
        const content = contentInput ? contentInput.value.trim() : "";
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const skipWeekends = skipWeekendsInput.checked;
        const isHoliday = isHolidayInput.checked;
        const isImportant = isImportantInput.checked;
        const isLunar = isLunarInput.checked;
        const annualRepeat = annualRepeatInput.checked; // 새로 추가된 필드

        if (!title) {
            this.showToast("제목을 입력해주세요.", "error");
            return;
        }

        if (!startDate || !endDate) {
            this.showToast("시작일과 종료일을 모두 선택해주세요.", "error");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            this.showToast("종료일은 시작일보다 빠를 수 없습니다.", "error");
            return;
        }

        schedule.title = title;
        schedule.content = content;
        schedule.startDate = startDate;
        schedule.endDate = endDate;
        schedule.skipWeekends = skipWeekends;
        schedule.isHoliday = isHoliday;
        schedule.isImportant = isImportant;
        schedule.isLunar = isLunar;
        schedule.annualRepeat = annualRepeat; // 새로 추가된 필드
        schedule.editedAt = this.formatDateTime(this.getKSTDate()); // 한국 표준시 사용

        schedule.validDates = this.calculateValidScheduleDates(schedule);

        this.saveData();

        // UI 업데이트를 먼저 수행
        this.renderAllSchedulesList();
        this.renderCalendar();
        if (this.currentMode === "schedule") {
            this.renderMonthlyCalendar();
        }
        if (
            document.getElementById("dailyScheduleModal").style.display === "flex"
        ) {
            this.renderDailyScheduleList(
                this.currentViewingDate,
                document.getElementById("dailyScheduleList")
            );
        }
        // 일정 상세 모달이 열려있다면 업데이트
        const detailModal = document.getElementById("scheduleDetailModal");
        if (
            detailModal.style.display === "flex" &&
            detailModal.dataset.scheduleId == schedule.id
        ) {
            this.showScheduleDetailModal(schedule);
        }
        this.updateModeStats();
        this.updateDashboardStats();

        this.hideScheduleEditModal();
        this.showToast("일정이 수정되었습니다!", "success");
    }

    initEventListeners() {
        // 연도 네비게이션
        document.getElementById("prevYear").addEventListener("click", () => {
            this.currentYear--;
            this.updateYearDisplay();
            this.renderCalendar();
            if (this.currentMode === "schedule") {
                this.renderMonthlyCalendar();
            }
        });

        document.getElementById("nextYear").addEventListener("click", () => {
            this.currentYear++;
            this.updateYearDisplay();
            this.renderCalendar();
            if (this.currentMode === "schedule") {
                this.renderMonthlyCalendar();
            }
        });

        // 모드 선택 버튼
        document.querySelectorAll(".mode-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const mode = btn.dataset.mode;
                this.switchMode(mode);
            });
        });

        // 로그아웃 버튼
        document.getElementById("logoutBtn").addEventListener("click", () => {
            this.logout();
        });

        // 월 네비게이션 (일정 모드)
        document.getElementById("prevMonth").addEventListener("click", () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
                this.updateYearDisplay();
                this.renderCalendar();
            }
            this.renderMonthlyCalendar();
        });

        document.getElementById("nextMonth").addEventListener("click", () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
                this.updateYearDisplay();
                this.renderCalendar();
            }
            this.renderMonthlyCalendar();
        });

        // 월/연도 클릭 이벤트 (새로운 기능)
        document
            .getElementById("currentMonthYear")
            .addEventListener("click", () => {
                this.showDatePickerModal();
            });

        // 오늘 버튼 클릭 이벤트 (새로운 기능)
        document.getElementById("todayBtn").addEventListener("click", () => {
            this.goToToday();
        });

        // 출석 관련 이벤트
        document.getElementById("attendBtn").addEventListener("click", () => {
            this.attendToday();
        });

        // 일정 관련 이벤트
        document
            .getElementById("viewAllSchedulesBtn")
            .addEventListener("click", () => {
                this.showAllSchedulesModal();
            });

        document
            .getElementById("clearSchedulesBtn")
            .addEventListener("click", () => {
                this.confirmClearAll("schedules");
            });

        // 투두리스트 이벤트
        document.getElementById("todoTabActive").addEventListener("click", () => {
            this.switchTodoTab("todo");
        });

        document
            .getElementById("todoTabCompleted")
            .addEventListener("click", () => {
                this.switchTodoTab("completed");
            });

        document.getElementById("todoAddBtn").addEventListener("click", () => {
            this.addTodo();
        });

        document.getElementById("todoInput").addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.addTodo();
            }
        });

        // 메모 이벤트
        document.getElementById("memoCreateBtn").addEventListener("click", () => {
            this.showMemoModal();
        });

        document.getElementById("memoSearchBtn").addEventListener("click", () => {
            this.searchMemos();
        });

        document
            .getElementById("memoSearchInput")
            .addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    this.searchMemos();
                }
            });

        document
            .getElementById("memoClearSearchBtn")
            .addEventListener("click", () => {
                this.clearMemoSearch();
            });

        // Day Counter 이벤트
        document
            .getElementById("counterCreateBtn")
            .addEventListener("click", () => {
                this.showCounterModal();
            });

        // 전체 삭제 버튼들
        document
            .getElementById("clearAttendanceBtn")
            .addEventListener("click", () => {
                this.confirmClearAll("attendance");
            });

        document.getElementById("todoClearBtn").addEventListener("click", () => {
            this.confirmClearAll("todo");
        });

        document
            .getElementById("completedClearBtn")
            .addEventListener("click", () => {
                this.confirmClearAll("completed");
            });

        document.getElementById("memoClearBtn").addEventListener("click", () => {
            this.confirmClearAll("memo");
        });

        document.getElementById("counterClearBtn").addEventListener("click", () => {
            this.confirmClearAll("counter");
        });

        // 모달 이벤트들
        this.initModalEvents();

        // 필터 해제 이벤트들
        this.initFilterEvents();
    }

    // 오늘로 이동하는 기능 (새로운 기능)
    goToToday() {
        const today = new Date();
        this.currentYear = today.getFullYear();
        this.currentMonth = today.getMonth();

        this.updateYearDisplay();
        this.renderCalendar();
        if (this.currentMode === "schedule") {
            this.renderMonthlyCalendar();
        }

        this.showToast("오늘 날짜로 이동했습니다.", "info");
    }

    // 날짜 선택 모달 (새로운 기능)
    showDatePickerModal() {
        const modal = document.getElementById("datePickerModal");
        const yearInput = document.getElementById("datePickerYear");
        const monthSelect = document.getElementById("datePickerMonth");

        yearInput.value = this.currentYear;
        monthSelect.value = this.currentMonth;

        modal.style.display = "flex";
        yearInput.focus();
    }

    hideDatePickerModal() {
        document.getElementById("datePickerModal").style.display = "none";
    }

    confirmDatePicker() {
        const yearInput = document.getElementById("datePickerYear");
        const monthSelect = document.getElementById("datePickerMonth");

        const newYear = parseInt(yearInput.value);
        const newMonth = parseInt(monthSelect.value);

        if (newYear < 1900 || newYear > 2100) {
            this.showToast("올바른 연도를 입력해주세요. (1900-2100)", "error");
            return;
        }

        this.currentYear = newYear;
        this.currentMonth = newMonth;

        this.updateYearDisplay();
        this.renderCalendar();
        if (this.currentMode === "schedule") {
            this.renderMonthlyCalendar();
        }

        this.hideDatePickerModal();
    }

    initModalEvents() {
        // 일정 모달
        document
            .getElementById("scheduleModalCancel")
            .addEventListener("click", () => {
                this.hideScheduleModal();
            });

        document
            .getElementById("scheduleModalConfirm")
            .addEventListener("click", () => {
                this.confirmScheduleModal();
            });

        // 날짜 입력 이벤트 - 한 번만 등록
        const startDateInput = document.getElementById("scheduleStartDate");
        const endDateInput = document.getElementById("scheduleEndDate");

        startDateInput.addEventListener("change", () => {
            endDateInput.min = startDateInput.value;
            if (endDateInput.value < startDateInput.value) {
                endDateInput.value = startDateInput.value;
            }
        });

        // 일정 편집 모달
        document
            .getElementById("scheduleEditCancel")
            .addEventListener("click", () => {
                this.hideScheduleEditModal();
            });

        document
            .getElementById("scheduleEditConfirm")
            .addEventListener("click", () => {
                this.confirmScheduleEdit();
            });

        // 일일 일정 모달
        document
            .getElementById("dailyScheduleModalClose")
            .addEventListener("click", () => {
                this.hideDailyScheduleModal();
            });

        document
            .getElementById("dailyScheduleAddBtn")
            .addEventListener("click", () => {
                const currentDate = this.currentViewingDate;
                this.hideDailyScheduleModal();
                this.showScheduleModal(currentDate);
            });

        // 일정 상세 보기 모달
        document
            .getElementById("scheduleDetailClose")
            .addEventListener("click", () => {
                this.hideScheduleDetailModal();
            });

        document
            .getElementById("scheduleDetailEdit")
            .addEventListener("click", () => {
                const scheduleId = document.getElementById("scheduleDetailModal")
                    .dataset.scheduleId;
                if (scheduleId) {
                    this.editSchedule(parseInt(scheduleId));
                    this.hideScheduleDetailModal();
                }
            });

        document
            .getElementById("scheduleDetailDelete")
            .addEventListener("click", () => {
                const scheduleId = document.getElementById("scheduleDetailModal")
                    .dataset.scheduleId;
                if (scheduleId) {
                    this.deleteSchedule(parseInt(scheduleId));
                    this.hideScheduleDetailModal();
                }
            });

        // 메모 모달
        document.getElementById("memoModalClose").addEventListener("click", () => {
            this.hideMemoModal();
        });

        document.getElementById("memoModalEdit").addEventListener("click", () => {
            this.toggleMemoEdit();
        });

        document
            .getElementById("memoModalConfirm")
            .addEventListener("click", () => {
                this.confirmMemoModal();
            });

        // Day Counter 모달
        document
            .getElementById("counterModalCancel")
            .addEventListener("click", () => {
                this.hideCounterModal();
            });

        document
            .getElementById("counterModalConfirm")
            .addEventListener("click", () => {
                this.confirmCounterModal();
            });

        // 전체 일정 보기 모달
        document
            .getElementById("allSchedulesClose")
            .addEventListener("click", () => {
                this.hideAllSchedulesModal();
            });

        document
            .getElementById("scheduleSearchBtn")
            .addEventListener("click", () => {
                this.searchSchedules();
            });

        document
            .getElementById("scheduleSearchInput")
            .addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    this.searchSchedules();
                }
            });

        // 일정 필터 셀렉트 이벤트
        document
            .getElementById("scheduleFilterSelect")
            .addEventListener("change", () => {
                this.filterSchedules();
            });

        // 확인 모달
        document
            .getElementById("confirmModalCancel")
            .addEventListener("click", () => {
                this.hideConfirmModal();
            });

        document
            .getElementById("confirmModalConfirm")
            .addEventListener("click", () => {
                this.executeConfirmAction();
            });

        // 출석 편집 모달
        document
            .getElementById("attendanceEditCancel")
            .addEventListener("click", () => {
                this.hideAttendanceEditModal();
            });

        document
            .getElementById("attendanceEditConfirm")
            .addEventListener("click", () => {
                this.confirmAttendanceEdit();
            });

        // 출석 로그 보기 모달
        document
            .getElementById("attendanceLogModalClose")
            .addEventListener("click", () => {
                this.hideAttendanceLogModal();
            });

        document
            .getElementById("attendanceLogModalDelete")
            .addEventListener("click", () => {
                this.deleteAttendanceFromModal();
            });

        // 날짜 선택 모달
        document
            .getElementById("datePickerCancel")
            .addEventListener("click", () => {
                this.hideDatePickerModal();
            });

        document
            .getElementById("datePickerConfirm")
            .addEventListener("click", () => {
                this.confirmDatePicker();
            });
    }

    initFilterEvents() {
            document
                .getElementById("scheduleFilterClear")
                .addEventListener("click", () => {
                    this.clearScheduleFilter();
                });

            document.getElementById("todoFilterClear").addEventListener("click", () => {
                this.clearTodoFilter();
            });

            document.getElementById("memoFilterClear").addEventListener("click", () => {
                this.clearMemoFilter();
            });

            document
                .getElementById("counterFilterClear")
                .addEventListener("click", () => {
                    this.clearCounterFilter();
                });
        }
        // 데이터 관리
    loadData() {
        try {
            const savedData = localStorage.getItem("attendanceCheckerData");
            if (savedData) {
                const data = JSON.parse(savedData);
                this.attendanceData = data.attendanceData || {};
                this.attendanceLog = data.attendanceLog || [];
                this.schedulesData = data.schedulesData || [];
                this.todoData = data.todoData || [];
                this.completedData = data.completedData || [];
                this.memoData = data.memoData || [];
                this.counterData = data.counterData || [];

                // 기존 일정 데이터에 validDates가 없는 경우 계산해서 추가
                this.schedulesData.forEach((schedule) => {
                    if (!schedule.validDates) {
                        schedule.validDates = this.calculateValidScheduleDates(schedule);
                    }
                    // 새로운 필드들 기본값 설정
                    if (schedule.content === undefined) schedule.content = "";
                    if (schedule.isHoliday === undefined) schedule.isHoliday = false;
                    if (schedule.isImportant === undefined) schedule.isImportant = false;
                    if (schedule.isLunar === undefined) schedule.isLunar = false;
                    if (schedule.annualRepeat === undefined) schedule.annualRepeat = false; // 새로 추가된 필드 기본값
                });
            }
        } catch (error) {
            console.error("Error loading data:", error);
            this.resetData();
        }

        // 데이터 타입 검증 및 수정
        if (!Array.isArray(this.memoData)) {
            console.warn("memoData is not an array, converting...");
            this.memoData = [];
        }
        if (!Array.isArray(this.todoData)) {
            this.todoData = [];
        }
        if (!Array.isArray(this.completedData)) {
            this.completedData = [];
        }
        if (!Array.isArray(this.schedulesData)) {
            this.schedulesData = [];
        }
        if (!Array.isArray(this.counterData)) {
            this.counterData = [];
        }
        if (!Array.isArray(this.attendanceLog)) {
            this.attendanceLog = [];
        }

        // 출석 로그에 메모 필드 추가 (기존 데이터 호환)
        this.attendanceLog = this.attendanceLog.map((log) => ({
            ...log,
            memo: log.memo || "",
            clockedOut: log.clockedOut || null,
        }));
    }

    saveData() {
        try {
            const data = {
                attendanceData: this.attendanceData,
                attendanceLog: this.attendanceLog,
                schedulesData: this.schedulesData,
                todoData: this.todoData,
                completedData: this.completedData,
                memoData: this.memoData,
                counterData: this.counterData,
            };
            localStorage.setItem("attendanceCheckerData", JSON.stringify(data));
        } catch (error) {
            console.error("Error saving data:", error);
        }
    }

    resetData() {
        this.attendanceData = {};
        this.attendanceLog = [];
        this.schedulesData = [];
        this.todoData = [];
        this.completedData = [];
        this.memoData = [];
        this.counterData = [];
    }

    getKSTDate() {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Seoul",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
        });
        const parts = formatter.formatToParts(now);
        const year = parts.find((p) => p.type === "year").value;
        const month = String(parts.find((p) => p.type === "month").value).padStart(
            2,
            "0"
        );
        const day = String(parts.find((p) => p.type === "day").value).padStart(
            2,
            "0"
        );
        const hour = String(parts.find((p) => p.type === "hour").value).padStart(
            2,
            "0"
        );
        const minute = String(
            parts.find((p) => p.type === "minute").value
        ).padStart(2, "0");
        const second = String(
            parts.find((p) => p.type === "second").value
        ).padStart(2, "0");
        return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    }

    // formatDateTime 함수 (기존 함수 완전 교체)
    formatDateTime(date) {
        // 한국 표준시로 변환
        const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

        const year = kstDate.getUTCFullYear();
        const month = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
        const day = String(kstDate.getUTCDate()).padStart(2, "0");
        const hours = String(kstDate.getUTCHours()).padStart(2, "0");
        const minutes = String(kstDate.getUTCMinutes()).padStart(2, "0");
        const seconds = String(kstDate.getUTCSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // 간략한 날짜 포맷팅 함수 (수정: 연-월-일 시:분:초 형식으로 변경)
    formatDateTimeShort(dateTimeString) {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // getDateKey 함수 수정
    getDateKey(date) {
        // 한국 표준시로 변환
        const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

        const year = kstDate.getUTCFullYear();
        const month = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
        const day = String(kstDate.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    updateDateTime() {
        const currentDateTimeElement = document.getElementById("currentDateTime");
        if (currentDateTimeElement) {
            const now = new Date();
            const dateTimeStr = now.toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            currentDateTimeElement.textContent = dateTimeStr;
        }
    }

    updateYearDisplay() {
        document.getElementById("currentYear").textContent = this.currentYear;
    }

    loadRandomBackground() {
        const randomNum = Math.floor(Math.random() * 10) + 1;
        const bgImage = document.getElementById("backgroundImage");
        const imagePath = `src/bg${randomNum}.jpg`;

        const testImage = new Image();
        testImage.onload = () => {
            bgImage.src = imagePath;
            bgImage.style.opacity = "0"; // 처음에는 투명하게
            bgImage.style.display = "block";

            // fade-in 효과
            setTimeout(() => {
                bgImage.style.opacity = "1";
            }, 50); // 아주 짧은 지연으로 transition 트리거
        };
        testImage.onerror = () => {
            bgImage.style.display = "none";
        };
        testImage.src = imagePath;
    }

    // 확인 모달
    showConfirmModal(title, message, action) {
        const modal = document.getElementById("confirmModal");
        const titleElement = document.getElementById("confirmModalTitle");
        const messageElement = document.getElementById("confirmModalMessage");

        titleElement.textContent = title;
        messageElement.textContent = message;
        this.pendingConfirmAction = action;

        modal.style.display = "flex";
    }

    hideConfirmModal() {
        document.getElementById("confirmModal").style.display = "none";
        this.pendingConfirmAction = null;
    }

    executeConfirmAction() {
        if (this.pendingConfirmAction) {
            this.pendingConfirmAction();
        }
        this.hideConfirmModal();
    }

    // 모드 전환
    switchMode(mode) {
        this.currentMode = mode;

        // year-nav 표시/숨김 처리
        const yearNav = document.querySelector(".year-nav");
        if (yearNav) {
            if (mode === "dashboard") {
                yearNav.style.display = "none";
            } else {
                yearNav.style.display = "flex";
            }
        }

        // header-center 내용 변경
        const headerCenter = document.querySelector(".header-center");
        if (headerCenter) {
            if (mode === "dashboard") {
                // 랜덤 폰트 선택
                const randomFontIndex = Math.floor(
                    Math.random() * this.titleFonts.length
                );
                const randomFont = this.titleFonts[randomFontIndex];

                headerCenter.innerHTML = `
            <div class="dashboard-title ${randomFont}">Memoria Vitae</div>
            <div class="dashboard-subtitle">삶의 기록</div>
        `;
            } else {
                headerCenter.innerHTML = `
            <div class="current-datetime" id="currentDateTime"></div>
            <div class="stats-info">
                <span>총 기록일: <span id="totalAttendance">0</span></span>
            </div>
        `;
                // 시간 업데이트 재시작
                this.updateDateTime();
                this.updateModeStats();
            }
        }

        // 모드 버튼 활성화 상태 업데이트
        document.querySelectorAll(".mode-btn").forEach((btn) => {
            if (btn.dataset.mode === mode) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        // 컨텐츠 패널 표시/숨김
        document.querySelectorAll(".content-panel").forEach((panel) => {
            panel.style.display = "none";
        });

        const contentMap = {
            dashboard: "dashboardContent",
            attendance: "attendanceContent",
            schedule: "scheduleContent",
            todo: "todoContent",
            memo: "memoContent",
            counter: "counterContent",
        };

        const targetContent = document.getElementById(contentMap[mode]);
        if (targetContent) {
            targetContent.style.display = "flex";
        }

        // 시각화 영역 처리 - display를 강제로 설정
        const dashboardClock = document.getElementById("dashboardClock");
        const calendarView = document.getElementById("calendarView");

        if (mode === "dashboard") {
            if (dashboardClock) dashboardClock.style.display = "flex";
            if (calendarView) calendarView.style.display = "none";
        } else {
            if (dashboardClock) dashboardClock.style.display = "none";
            if (calendarView) {
                calendarView.style.display = "flex";
                calendarView.style.visibility = "visible";
            }
        }

        // 모드별 초기화
        if (mode === "schedule") {
            this.renderMonthlyCalendar();
        } else if (mode === "todo") {
            this.renderTodoList();
        } else if (mode === "memo") {
            this.renderMemoList();
        } else if (mode === "counter") {
            this.renderCounterList();
        } else if (mode === "attendance") {
            this.renderAttendanceLog();
        } else if (mode === "dashboard") {
            this.updateDashboardStats();
            this.displayRandomQuote();
            this.displayRandomWelcomeMessage();
        }

        // 통계 업데이트
        this.updateModeStats();

        // 시각화 캘린더 업데이트
        this.renderCalendar();
    }

    // 출석 관리
    isAttended(date) {
        return this.attendanceData[this.getDateKey(date)] || false;
    }

    toggleAttendance(date) {
        const key = this.getDateKey(date);
        const wasAttended = this.attendanceData[key];

        if (wasAttended) {
            // 이미 출석된 날짜 클릭 시 로그 보기
            this.showAttendanceLogForDate(date);
            return;
        }

        this.attendanceData[key] = true;

        // 출석 체크 - 로그에 추가
        const logEntry = {
            date: key,
            timestamp: this.formatDateTime(new Date()),
            memo: "",
            clockedOut: null,
            id: Date.now(),
        };
        this.attendanceLog.push(logEntry);

        this.saveData();
        this.updateStats();
        this.updateModeStats();
        this.updateDashboardStats();
        this.renderAttendanceLog();
    }

    // attendToday 함수 수정 (한국 표준시 사용)
    attendToday() {
        const today = this.getKSTDate();
        const key = this.getDateKey(today);

        if (this.attendanceData[key]) {
            this.showToast("오늘의 데이 로그가 이미 생성되었습니다!", "warning");
            return;
        }

        this.attendanceData[key] = true;

        const logEntry = {
            date: key,
            timestamp: this.formatDateTime(today),
            memo: "",
            clockedOut: null,
            id: Date.now(),
        };
        this.attendanceLog.push(logEntry);

        this.saveData();
        this.updateStats();
        this.updateDashboardStats();
        this.updateModeStats(); // stats 즉시 업데이트
        this.renderAttendanceLog();
        this.renderCalendar();
        this.showToast("데이 로그가 기록되었습니다!", "success");
    }

    // clockOutAttendance 함수 수정 (한국 표준시 사용)
    clockOutAttendance(id) {
        const log = this.attendanceLog.find((l) => l.id === id);
        if (log && !log.clockedOut) {
            log.clockedOut = this.formatDateTime(this.getKSTDate()); // 한국 표준시 사용
            this.saveData();
            this.renderAttendanceLog();
            this.showToast("데이 로그가 기록되었습니다!", "success");
        }
    }

    deleteAttendanceLog(id) {
        this.showConfirmModal(
            "데이 로그 삭제",
            "이 기록을 삭제하시겠습니까?",
            () => {
                const logIndex = this.attendanceLog.findIndex((l) => l.id === id);
                if (logIndex !== -1) {
                    const log = this.attendanceLog[logIndex];
                    delete this.attendanceData[log.date];
                    this.attendanceLog.splice(logIndex, 1);
                    this.saveData();
                    this.updateStats();
                    this.updateDashboardStats();
                    this.updateModeStats(); // stats 즉시 업데이트
                    this.renderAttendanceLog();
                    this.renderCalendar();
                    this.showToast("데이 로그가 삭제되었습니다!", "success");
                }
            }
        );
    }

    deleteAttendanceFromModal() {
        // 현재 출석 로그 모달에서 보고 있는 날짜의 출석 기록들을 삭제
        if (!this.currentViewingDate) return;

        const dateKey = this.getDateKey(this.currentViewingDate);
        const logs = this.attendanceLog.filter((log) => log.date === dateKey);

        if (logs.length === 0) return;

        // 모달을 먼저 닫고 삭제 확인 진행
        this.hideAttendanceLogModal();

        this.showConfirmModal(
            "데이 로그 삭제",
            `이 날짜의 기록을 삭제하시겠습니까?`,
            () => {
                // 해당 날짜의 모든 출석 로그 삭제
                this.attendanceLog = this.attendanceLog.filter(
                    (log) => log.date !== dateKey
                );
                delete this.attendanceData[dateKey];

                this.saveData();
                this.updateStats();
                this.updateDashboardStats();
                this.renderAttendanceLog();
                this.renderCalendar();
                this.showToast("데이 로그가 삭제되었습니다!", "success");
            }
        );
    }
    showAttendanceEditModal(id) {
        const log = this.attendanceLog.find((l) => l.id === id);
        if (!log) return;

        this.currentEditingAttendance = id;
        const modal = document.getElementById("attendanceEditModal");
        const memoInput = document.getElementById("attendanceEditMemo");
        const checkedInInput = document.getElementById("attendanceEditCheckedIn");
        const clockedOutInput = document.getElementById("attendanceEditClockedOut");

        memoInput.value = log.memo || "";

        // timestamp를 datetime-local 형식으로 변환
        const checkedInDate = new Date(log.timestamp);
        checkedInInput.value = this.formatDateTimeLocal(checkedInDate);

        if (log.clockedOut) {
            const clockedOutDate = new Date(log.clockedOut);
            clockedOutInput.value = this.formatDateTimeLocal(clockedOutDate);
        } else {
            clockedOutInput.value = "";
        }

        modal.style.display = "flex";
        memoInput.focus();
    }

    hideAttendanceEditModal() {
        document.getElementById("attendanceEditModal").style.display = "none";
        this.currentEditingAttendance = null;
    }

    confirmAttendanceEdit() {
        if (!this.currentEditingAttendance) return;

        const log = this.attendanceLog.find(
            (l) => l.id === this.currentEditingAttendance
        );
        if (!log) return;

        const memoInput = document.getElementById("attendanceEditMemo");
        const checkedInInput = document.getElementById("attendanceEditCheckedIn");
        const clockedOutInput = document.getElementById("attendanceEditClockedOut");

        log.memo = memoInput.value.trim();

        if (checkedInInput.value) {
            const checkedInDate = new Date(checkedInInput.value);
            log.timestamp = this.formatDateTime(checkedInDate);
        }

        if (clockedOutInput.value) {
            const clockedOutDate = new Date(clockedOutInput.value);
            log.clockedOut = this.formatDateTime(clockedOutDate);
        } else {
            log.clockedOut = null;
        }

        this.saveData();
        this.renderAttendanceLog();
        this.hideAttendanceEditModal();
        this.showToast("데이 로그가 수정되었습니다!", "success");
    }

    formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    showAttendanceLogForDate(date) {
        const dateKey = this.getDateKey(date);
        const logs = this.attendanceLog.filter((log) => log.date === dateKey);

        this.currentViewingDate = date; // 현재 보고 있는 날짜 저장

        const modal = document.getElementById("attendanceLogModal");
        const title = document.getElementById("attendanceLogModalTitle");
        const content = document.getElementById("attendanceLogModalContent");

        const formattedDate = date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
        });

        title.textContent = `데이 로그 - ${formattedDate}`;
        content.innerHTML = "";

        if (logs.length === 0) {
            content.innerHTML = "<p>이 날짜의 데이 로그가 없습니다.</p>";
        } else {
            logs.forEach((log) => {
                const logElement = document.createElement("div");
                logElement.className = "attendance-log-detail";

                let timeInfo = `로그 시작 : ${log.timestamp}`;
                if (log.clockedOut) {
                    timeInfo += `<br>로그 종료 : ${log.clockedOut}`;
                }

                logElement.innerHTML = `
                    <div class="attendance-log-memo">${
                      log.memo || "메모 없음"
                    }</div>
                    <div class="attendance-log-time">${timeInfo}</div>
                `;
                content.appendChild(logElement);
            });
        }

        modal.style.display = "flex";
    }

    hideAttendanceLogModal() {
        document.getElementById("attendanceLogModal").style.display = "none";
        this.currentViewingDate = null;
    }

    updateStats() {
        const totalDaysElement = document.getElementById("totalDays");
        const streakDaysElement = document.getElementById("streakDays");
        const longestStreakElement = document.getElementById("longestStreak");
        const attendanceRateElement = document.getElementById("attendanceRate");

        const totalDays = Object.keys(this.attendanceData).length;
        let streakDays = 0;
        let longestStreak = 0;
        let currentStreak = 0;
        const today = this.getDateKey(this.getKSTDate());
        const sortedDates = Object.keys(this.attendanceData).sort();

        for (let i = 0; i < sortedDates.length; i++) {
            if (i === 0) {
                currentStreak = 1;
            } else {
                const prevDate = new Date(sortedDates[i - 1]);
                const currentDate = new Date(sortedDates[i]);
                const diffDays = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
                if (diffDays === 1) {
                    currentStreak++;
                } else {
                    currentStreak = 1;
                }
            }
            longestStreak = Math.max(longestStreak, currentStreak);
            if (sortedDates[i] === today) {
                streakDays = currentStreak;
            }
        }

        const totalPossibleDays =
            Math.ceil(
                (new Date(today) - new Date(sortedDates[0])) / (1000 * 60 * 60 * 24)
            ) || 1;
        const attendanceRate = ((totalDays / totalPossibleDays) * 100).toFixed(2);

        // DOM 요소가 존재할 때만 업데이트
        if (totalDaysElement) totalDaysElement.textContent = totalDays;
        if (streakDaysElement) streakDaysElement.textContent = streakDays;
        if (longestStreakElement) longestStreakElement.textContent = longestStreak;
        if (attendanceRateElement)
            attendanceRateElement.textContent = `${attendanceRate}%`;
    }

    updateModeStats() {
        const statsElement = document.getElementById("totalAttendance");
        if (!statsElement) return;

        const currentYearStart = new Date(this.currentYear, 0, 1);
        const currentYearEnd = new Date(this.currentYear, 11, 31);

        let count = 0;
        let label = "";

        switch (this.currentMode) {
            case "dashboard":
                count = Object.values(this.attendanceData).filter(Boolean).length;
                label = "총 기록일";
                break;

            case "attendance":
                count = Object.values(this.attendanceData).filter(Boolean).length;
                label = "총 기록일";
                break;

            case "schedule":
                count = this.schedulesData.filter((schedule) => {
                    const scheduleYear = new Date(schedule.startDate).getFullYear();
                    return scheduleYear === this.currentYear;
                }).length;
                label = "총 일정";
                break;

            case "todo":
                if (this.activeTab === "completed") {
                    count = this.completedData.filter((todo) => {
                        if (!todo.completedAt) return false;
                        const completedYear = new Date(todo.completedAt).getFullYear();
                        return completedYear === this.currentYear;
                    }).length;
                    label = "완료된 할 일";
                } else {
                    count = this.todoData.filter((todo) => {
                        const createdYear = new Date(todo.createdAt).getFullYear();
                        return createdYear === this.currentYear;
                    }).length;
                    label = "총 할 일";
                }
                break;

            case "memo":
                count = this.memoData.filter((memo) => {
                    const createdYear = new Date(memo.createdAt).getFullYear();
                    return createdYear === this.currentYear;
                }).length;
                label = "총 메모";
                break;

            case "counter":
                count = this.counterData.filter((counter) => {
                    const createdYear = new Date(counter.createdAt).getFullYear();
                    return createdYear === this.currentYear;
                }).length;
                label = "총 카운터";
                break;

            default:
                count = Object.values(this.attendanceData).filter(Boolean).length;
                label = "총 기록일";
        }

        // stats-info 업데이트
        statsElement.textContent = count;

        // 라벨 업데이트
        const statsContainer = statsElement.parentElement;
        if (statsContainer) {
            statsContainer.innerHTML = `${label}: <span id="totalAttendance">${count}</span>`;
        }
    }

    renderAttendanceLog() {
            const logContainer = document.getElementById("attendanceLog");
            logContainer.innerHTML = "";

            if (this.attendanceLog.length === 0) {
                const emptyState = document.createElement("div");
                emptyState.className = "empty-state";
                emptyState.innerHTML = `
            <h3>데이 로그 없음</h3>
            <p>위 캘린더의 날짜를 클릭하거나 기록하기 버튼을 눌러 오늘을 기록하세요</p>
        `;
                logContainer.appendChild(emptyState);
                return;
            }

            // log.date 기준 내림차순 정렬 (미래 날짜가 위로, 과거 날짜가 아래로)
            const sortedLog = [...this.attendanceLog].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            sortedLog.forEach((log) => {
                        const item = document.createElement("div");
                        item.className = "attendance-log-item";

                        const date = new Date(log.date);
                        const formattedDate = date.toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        });

                        const startTime = log.timestamp ?
                            new Date(log.timestamp).toLocaleTimeString("ko-KR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            }) :
                            "미체크인";
                        const endTime = log.clockedOut ?
                            new Date(log.clockedOut).toLocaleTimeString("ko-KR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            }) :
                            "미체크아웃";

                        // 시간 정보 구성: 로그일 | 로그 시작 | 로그 종료
                        const timeInfo = `로그일: ${formattedDate} | 로그 시작: ${startTime} | 로그 종료: ${endTime}`;

                        // 메모 입력 필드 - readonly로 설정
                        const memoValue = log.memo || "";

                        item.innerHTML = `
            <div class="attendance-info">
                <input type="text" class="attendance-memo-input" value="${memoValue}" 
                    placeholder="하루를 간단하게 기록해보세요..." readonly>
                <div class="attendance-time">${timeInfo}</div>
            </div>
            <div class="attendance-item-controls">
                ${
                  !log.clockedOut
                    ? `<button class="attendance-btn clock-out" onclick="attendanceChecker.clockOutAttendance(${log.id})">로그 종료</button>`
                    : ""
                }
                <button class="attendance-btn edit" onclick="attendanceChecker.showAttendanceEditModal(${
                  log.id
                })">편집</button>
                <button class="attendance-btn delete" onclick="attendanceChecker.deleteAttendanceLog(${
                  log.id
                })">삭제</button>
            </div>
        `;

      logContainer.appendChild(item);
    });

    this.updateStats();
  }

  updateAttendanceMemo(id, memo) {
    const log = this.attendanceLog.find((l) => l.id === id);
    if (log) {
      log.memo = memo;
      this.saveData();
    }
  }

  // 캘린더 시각화
  renderCalendar() {
    const calendar = document.getElementById("calendar");
    if (!calendar) {
      console.warn("Calendar element not found");
      return;
    }

    calendar.innerHTML = "";

    const startDate = new Date(this.currentYear, 0, 1);
    const endDate = new Date(this.currentYear, 11, 31);

    const firstWeekStart = new Date(startDate);
    firstWeekStart.setDate(startDate.getDate() - startDate.getDay());

    let currentDate = new Date(firstWeekStart);

    while (currentDate <= endDate || currentDate.getDay() !== 0) {
      const weekColumn = document.createElement("div");
      weekColumn.className = "week-column";

      // 월 라벨 체크
      let hasNewMonth = false;
      let newMonthName = "";

      for (let i = 0; i < 7; i++) {
        const testDate = new Date(currentDate);
        testDate.setDate(currentDate.getDate() + i);

        if (
          testDate.getDate() === 1 &&
          testDate.getFullYear() === this.currentYear
        ) {
          hasNewMonth = true;
          const monthNames = [
            "1월",
            "2월",
            "3월",
            "4월",
            "5월",
            "6월",
            "7월",
            "8월",
            "9월",
            "10월",
            "11월",
            "12월",
          ];
          newMonthName = monthNames[testDate.getMonth()];
          break;
        }
      }

      if (hasNewMonth) {
        const monthLabel = document.createElement("div");
        monthLabel.className = "month-label";
        monthLabel.textContent = newMonthName;
        weekColumn.appendChild(monthLabel);
      }

      // 일주일 날짜 셀 생성
      for (let day = 0; day < 7; day++) {
        const dayCell = document.createElement("div");
        dayCell.className = "day-cell";

        const cellDate = new Date(currentDate);

        if (cellDate.getFullYear() !== this.currentYear) {
          dayCell.classList.add("empty");
        } else {
          this.applyVisualizationStyles(dayCell, cellDate);

          // 클릭 이벤트 추가
          dayCell.addEventListener("click", () => {
            this.handleCalendarClick(cellDate);
          });
        }

        // 툴팁 이벤트
        if (!dayCell.classList.contains("empty")) {
          dayCell.addEventListener("mouseenter", (e) => {
            this.showTooltip(e, cellDate);
          });

          dayCell.addEventListener("mouseleave", () => {
            this.hideTooltip();
          });

          dayCell.addEventListener("mousemove", (e) => {
            this.updateTooltipPosition(e);
          });
        }

        weekColumn.appendChild(dayCell);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      calendar.appendChild(weekColumn);

      if (currentDate.getFullYear() > this.currentYear) {
        break;
      }
    }
  }
  // 수정된 applyVisualizationStyles 함수 (중요한 날과 휴일 우선순위 적용)
  applyVisualizationStyles(dayCell, date) {
    dayCell.classList.add("level-0");

    if (this.currentMode === "attendance") {
      if (this.isAttended(date)) {
        dayCell.classList.add("attended");
      }
    } else if (this.currentMode === "schedule") {
      const schedules = this.getSchedulesForDate(date);
      if (schedules.length > 0) {
        // 중요한 날과 휴일 우선순위 처리
        const importantSchedules = schedules.filter((s) => s.isImportant);
        const holidaySchedules = schedules.filter((s) => s.isHoliday);

        if (importantSchedules.length > 0) {
          dayCell.classList.add("important-day");
        } else if (holidaySchedules.length > 0) {
          dayCell.classList.add("holiday");
        } else {
          dayCell.classList.add("schedule-active");

          // 일반 일정 개수에 따른 밝기 조절
          if (schedules.length === 1) {
            dayCell.classList.add("schedule-single"); // 50% 밝기
          } else if (schedules.length === 2) {
            dayCell.classList.add("schedule-double"); // 75% 밝기
          } else {
            dayCell.classList.add("schedule-multiple"); // 100% 밝기
          }
        }
      }
    } else if (this.currentMode === "todo") {
      const createdTodos = this.getTodosCreatedOnDate(date);
      const completedTodos = this.getTodosCompletedOnDate(date);

      if (this.activeTab === "todo" && createdTodos.length > 0) {
        dayCell.classList.add("todo-created");
      } else if (this.activeTab === "completed" && completedTodos.length > 0) {
        dayCell.classList.add("todo-completed");
      }
    } else if (this.currentMode === "memo") {
      const memos = this.getMemosCreatedOnDate(date);
      if (memos.length > 0) {
        dayCell.classList.add("memo-created");
      }
    } else if (this.currentMode === "counter") {
      const counters = this.getCountersForDate(date);
      if (counters.length > 0) {
        dayCell.classList.add("counter-target");
      }
    }
  }

  handleCalendarClick(date) {
    if (this.currentMode === "attendance") {
      this.toggleAttendance(date);
      this.renderCalendar();
    } else if (this.currentMode === "schedule") {
      // 일정이 있는지 확인
      const schedules = this.getSchedulesForDate(date);
      if (schedules.length > 0) {
        // 일정이 있으면 일일 일정 리스트 모달 표시
        this.showDailyScheduleModal(date);
      } else {
        // 일정이 없으면 바로 일정 추가 모달 표시
        this.showScheduleModal(date);
      }
    } else if (this.currentMode === "todo") {
      const dateKey = this.getDateKey(date);
      this.setTodoFilter(dateKey);
      this.switchMode("todo");
    } else if (this.currentMode === "memo") {
      const dateKey = this.getDateKey(date);
      this.setMemoFilter(dateKey);
      this.switchMode("memo");
    } else if (this.currentMode === "counter") {
      const dateKey = this.getDateKey(date);
      this.setCounterFilter(dateKey);
      this.switchMode("counter");
    }
  }

  // 일일 일정 모달 관련 함수들
  showDailyScheduleModal(date) {
    this.currentViewingDate = date;
    const modal = document.getElementById("dailyScheduleModal");
    const title = document.getElementById("dailyScheduleModalTitle");
    const list = document.getElementById("dailyScheduleList");

    const formattedDate = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    title.textContent = `${formattedDate} 일정`;

    this.renderDailyScheduleList(date, list);
    modal.style.display = "flex";
  }

  hideDailyScheduleModal() {
    document.getElementById("dailyScheduleModal").style.display = "none";
    this.currentViewingDate = null;
  }

  renderDailyScheduleList(date, container) {
    const schedules = this.getSchedulesForDate(date);
    container.innerHTML = "";

    if (schedules.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.innerHTML = `
                <h3>일정이 없습니다</h3>
                <p>이 날짜에 등록된 일정이 없습니다.</p>
            `;
      container.appendChild(emptyState);
      return;
    }

    // 중요한 날을 먼저 표시하도록 정렬
    schedules.sort((a, b) => {
      if (a.isImportant && !b.isImportant) return -1;
      if (!a.isImportant && b.isImportant) return 1;
      if (a.isHoliday && !b.isHoliday) return -1;
      if (!a.isHoliday && b.isHoliday) return 1;
      return 0;
    });

    schedules.forEach((schedule) => {
      const item = document.createElement("div");
      item.className = "schedule-item";

      if (schedule.isImportant) {
        item.classList.add("important");
      } else if (schedule.isHoliday) {
        item.classList.add("holiday");
      }

      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);
      const dateText =
        schedule.startDate === schedule.endDate
          ? startDate.toLocaleDateString("ko-KR")
          : `${startDate.toLocaleDateString(
              "ko-KR"
            )} - ${endDate.toLocaleDateString("ko-KR")}`;

      // 제목과 내용 길이 제한 (40글자로 변경)
      const truncatedTitle = this.truncateText(schedule.title, 40);
      const truncatedContent = this.truncateText(schedule.content || "", 40);

      item.innerHTML = `
                <div class="schedule-item-info">
                    <div class="schedule-item-title">${truncatedTitle}</div>
                    ${
                      schedule.content
                        ? `<div class="schedule-item-content">${truncatedContent}</div>`
                        : ""
                    }
                    <div class="schedule-item-date">${dateText}</div>
                    <div class="schedule-item-created">생성일: ${this.formatDateTimeShort(
                      schedule.createdAt
                    )}</div>
                </div>
                <div class="schedule-item-controls">
                    <button class="schedule-edit-btn">편집</button>
                    <button class="schedule-delete-btn">삭제</button>
                </div>
            `;

      // 클릭 이벤트: 일정 상세 보기
      item.addEventListener("click", (e) => {
        if (
          e.target.classList.contains("schedule-edit-btn") ||
          e.target.classList.contains("schedule-delete-btn")
        )
          return;
        this.showScheduleDetailModal(schedule);
      });

      // 편집/삭제 버튼 이벤트
      const editBtn = item.querySelector(".schedule-edit-btn");
      const deleteBtn = item.querySelector(".schedule-delete-btn");

      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.editSchedule(schedule.id);
      });

      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteSchedule(schedule.id);
      });

      container.appendChild(item);
    });
  }

  // 일정 상세 보기 모달
  showScheduleDetailModal(schedule) {
    const modal = document.getElementById("scheduleDetailModal");
    modal.dataset.scheduleId = schedule.id;

    document.getElementById("scheduleDetailTitle").textContent = schedule.title;

    const contentField = document.getElementById("scheduleDetailContentField");
    const contentDiv = document.getElementById("scheduleDetailContent");
    if (schedule.content) {
      contentField.style.display = "flex";
      contentDiv.textContent = schedule.content;
    } else {
      contentField.style.display = "none";
    }

    const startDate = new Date(schedule.startDate);
    const endDate = new Date(schedule.endDate);

    // 기간 계산 및 표시 (수정된 부분: 주말 제외 옵션 반영)
    let periodText;
    if (schedule.startDate === schedule.endDate) {
      periodText = startDate.toLocaleDateString("ko-KR");
    } else {
      // 실제 유효한 날짜들의 개수 사용 (주말 제외 옵션 반영)
      const validDatesCount = schedule.validDates
        ? schedule.validDates.length
        : 1;
      periodText = `${startDate.toLocaleDateString(
        "ko-KR"
      )} - ${endDate.toLocaleDateString(
        "ko-KR"
      )} (총 ${validDatesCount}일 일정)`;
    }
    document.getElementById("scheduleDetailPeriod").textContent = periodText;

    // 옵션 표시
    const options = [];
    if (schedule.skipWeekends) options.push("주말 제외");
    if (schedule.isHoliday) options.push("휴일");
    if (schedule.isImportant) options.push("중요한 날");
    if (schedule.isLunar) options.push("음력");
    document.getElementById("scheduleDetailOptions").textContent =
      options.length > 0 ? options.join(", ") : "없음";

    // 생성일/수정일 간략 표시 (수정된 부분: 연-월-일 시:분:초 형식)
    document.getElementById("scheduleDetailCreated").textContent =
      this.formatDateTimeShort(schedule.createdAt);

    const editedField = document.getElementById("scheduleDetailEditedField");
    const editedDiv = document.getElementById("scheduleDetailEdited");
    if (schedule.editedAt) {
      editedField.style.display = "flex";
      editedDiv.textContent = this.formatDateTimeShort(schedule.editedAt);
    } else {
      editedField.style.display = "none";
    }

    modal.style.display = "flex";
  }

  hideScheduleDetailModal() {
    document.getElementById("scheduleDetailModal").style.display = "none";
    delete document.getElementById("scheduleDetailModal").dataset.scheduleId;
  }

  // 텍스트 자르기 함수
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }

  // 툴팁
  showTooltip(e, date) {
    const tooltip = document.getElementById("tooltip");
    const content = this.getTooltipContent(date);

    tooltip.innerHTML = content;
    tooltip.style.display = "block";
    this.updateTooltipPosition(e);
  }

  // 개선된 툴팁 내용 생성 (수정된 부분: 일정 내용 표시 제거, 제목만 표시)
  getTooltipContent(date) {
    const formattedDate = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let content = formattedDate;

    if (this.currentMode === "attendance") {
      if (this.isAttended(date)) {
        content += "<br>✓ 기록함 (클릭하여 세부정보 보기)";
      }
    } else if (this.currentMode === "schedule") {
      const schedules = this.getSchedulesForDate(date);
      if (schedules.length > 0) {
        schedules.forEach((schedule) => {
          const isHoliday = schedule.isHoliday;
          const isImportant = schedule.isImportant;

          // 제목만 100글자로 제한 (내용은 표시하지 않음)
          const titleText = this.truncateText(schedule.title, 100);

          if (isHoliday) {
            content += `<br>휴일: ${titleText}`;
          } else if (isImportant) {
            content += `<br>중요: ${titleText}`;
          } else {
            content += `<br>일정: ${titleText}`;
          }
        });
      }
    } else if (this.currentMode === "todo") {
      const created = this.getTodosCreatedOnDate(date);
      const completed = this.getTodosCompletedOnDate(date);
      if (created.length > 0) {
        content += `<br>할 일 생성: ${created.length}개`;
      }
      if (completed.length > 0) {
        content += `<br>할 일 완료: ${completed.length}개`;
      }
    } else if (this.currentMode === "memo") {
      const memos = this.getMemosCreatedOnDate(date);
      if (memos.length > 0) {
        content += `<br>메모: ${memos.length}개`;
      }
    } else if (this.currentMode === "counter") {
      const counters = this.getCountersForDate(date);
      if (counters.length > 0) {
        content += "<br>카운터:";
        counters.forEach((counter) => {
          content += `<br>• ${counter.title}`;
        });
      }
    }

    return content;
  }
  updateTooltipPosition(e) {
    const tooltip = document.getElementById("tooltip");
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = e.pageX + 10;
    let top = e.pageY - 30;

    if (left + tooltipRect.width > viewportWidth) {
      left = e.pageX - tooltipRect.width - 10;
    }

    if (left < 0) {
      left = 10;
    }

    if (top < 0) {
      top = e.pageY + 20;
    }

    if (top + tooltipRect.height > viewportHeight) {
      top = e.pageY - tooltipRect.height - 10;
    }

    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
  }

  hideTooltip() {
    document.getElementById("tooltip").style.display = "none";
  }

  // 일정 관리
  showScheduleModal(date = null) {
    this.currentSelectedDate = date;
    const modal = document.getElementById("scheduleModal");
    const title = document.getElementById("scheduleModalTitle");

    // 편집 모드가 아닌 새 일정 추가이므로 초기화
    this.currentEditingSchedule = null;

    if (date) {
      const formattedDate = date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      title.textContent = `일정 추가 - ${formattedDate}`;

      const dateKey = this.getDateKey(date);
      document.getElementById("scheduleStartDate").value = dateKey;
      document.getElementById("scheduleEndDate").value = dateKey;
    } else {
      const today = new Date();
      const todayKey = this.getDateKey(today);
      title.textContent = "일정 추가";
      document.getElementById("scheduleStartDate").value = todayKey;
      document.getElementById("scheduleEndDate").value = todayKey;
    }

    // 모달을 먼저 표시
    modal.style.display = "flex";

    // 모달이 표시된 후 필드 초기화 (DOM 요소 접근 보장)
    setTimeout(() => {
      const textInput = document.getElementById("scheduleText");
      const contentInput = document.getElementById("scheduleContentText");
      const startDateInput = document.getElementById("scheduleStartDate");
      const endDateInput = document.getElementById("scheduleEndDate");
      const skipWeekendsInput = document.getElementById("scheduleSkipWeekends");
      const isHolidayInput = document.getElementById("scheduleIsHoliday");
      const isImportantInput = document.getElementById("scheduleIsImportant");
      const isLunarInput = document.getElementById("scheduleIsLunar");
      const annualRepeatInput = document.getElementById("annualRepeat");  // 새로 추가된 체크박스

      // 모든 필드 완전 초기화
      textInput.value = "";
      contentInput.value = ""; // 강제로 빈 문자열 설정
      skipWeekendsInput.checked = false;
      isHolidayInput.checked = false;
      isImportantInput.checked = false;
      isLunarInput.checked = false;
      annualRepeatInput.checked = false;  // 새로 추가된 초기화

      startDateInput.removeAttribute("min");
      endDateInput.removeAttribute("min");

      textInput.focus();
    }, 50);
}

  hideScheduleModal() {
    document.getElementById("scheduleModal").style.display = "none";
    this.currentSelectedDate = null;
    this.currentEditingSchedule = null;
  }

  // confirmScheduleModal 함수 수정 (한국 표준시 사용)
  confirmScheduleModal() {
    const textInput = document.getElementById("scheduleText");
    const contentInput = document.getElementById("scheduleContentText");
    const startDateInput = document.getElementById("scheduleStartDate");
    const endDateInput = document.getElementById("scheduleEndDate");
    const skipWeekendsInput = document.getElementById("scheduleSkipWeekends");
    const isHolidayInput = document.getElementById("scheduleIsHoliday");
    const isImportantInput = document.getElementById("scheduleIsImportant");
    const isLunarInput = document.getElementById("scheduleIsLunar");
    const annualRepeatInput = document.getElementById("annualRepeat");  // 새로 추가된 체크박스

    if (!textInput || !contentInput || !startDateInput || !endDateInput) {
      console.error("Required input elements not found");
      this.showToast("입력 오류가 발생했습니다.", "error");
      return;
    }

    const title = textInput.value.trim();
    const content = contentInput.value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const skipWeekends = skipWeekendsInput.checked;
    const isHoliday = isHolidayInput.checked;
    const isImportant = isImportantInput.checked;
    const isLunar = isLunarInput.checked;
    const annualRepeat = annualRepeatInput.checked;  // 새로 추가된 필드

    if (!title) {
      this.showToast("일정 제목을 입력해주세요.", "error");
      return;
    }

    if (!startDate || !endDate) {
      this.showToast("시작일과 종료일을 모두 선택해주세요.", "error");
      return;
    }

    const startDateObj = new Date(startDate + "T00:00:00");
    const endDateObj = new Date(endDate + "T00:00:00");

    if (startDateObj > endDateObj) {
      this.showToast("종료일은 시작일보다 빠를 수 없습니다.", "error");
      return;
    }

    const schedule = {
      id: Date.now(),
      title: title,
      content: content,
      startDate: startDate,
      endDate: endDate,
      skipWeekends: skipWeekends,
      isHoliday: isHoliday,
      isImportant: isImportant,
      isLunar: isLunar,
      annualRepeat: annualRepeat,  // 새로 추가된 필드
      createdAt: this.formatDateTime(this.getKSTDate()), // 한국 표준시 사용
    };

    schedule.validDates = this.calculateValidScheduleDates(schedule);
    this.schedulesData.push(schedule);
    this.saveData();

    this.hideScheduleModal();

    setTimeout(() => {
      this.renderCalendar();
      if (this.currentMode === "schedule") {
        this.renderMonthlyCalendar();
      }
      this.updateModeStats();
      this.updateDashboardStats();
      this.renderAllSchedulesList();
      if (
        document.getElementById("dailyScheduleModal").style.display === "flex"
      ) {
        this.renderDailyScheduleList(
          this.currentViewingDate,
          document.getElementById("dailyScheduleList")
        );
      }
    }, 50);

    this.showToast("일정이 생성되었습니다!", "success");
}

  // 날짜 유효성 검사 함수 추가
  isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString + "T00:00:00");
    return date.toISOString().split("T")[0] === dateString;
  }

  getSchedulesForDate(date) {
    const dateStr = this.getDateKey(date);
    return this.schedulesData.filter((schedule) => {
      // 유효한 날짜 목록이 없으면 계산
      if (!schedule.validDates) {
        schedule.validDates = this.calculateValidScheduleDates(schedule);
      }

      // 유효한 날짜 목록에 포함되어 있는지 확인
      return schedule.validDates.includes(dateStr);
    });
  }

  renderMonthlyCalendar() {
    const monthNames = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];

    // DOM 요소 존재 확인
    const currentMonthYearElement = document.getElementById("currentMonthYear");
    const tbodyElement = document.getElementById("monthlyCalendarBody");

    if (!currentMonthYearElement || !tbodyElement) {
      return;
    }

    // 현재 모드가 schedule이 아니면 실행하지 않음 - 이 부분을 DOM 확인 후로 이동
    if (this.currentMode !== "schedule") {
      return;
    }

    currentMonthYearElement.textContent = `${this.currentYear}년 ${
      monthNames[this.currentMonth]
    }`;

    tbodyElement.innerHTML = "";

    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    let currentDate = new Date(startDate);
    const today = new Date();

    while (currentDate <= endDate) {
      const row = document.createElement("tr");

      for (let day = 0; day < 7; day++) {
        const cell = document.createElement("td");

        const dayContainer = document.createElement("div");
        dayContainer.className = "calendar-day-container";

        const dayNum = document.createElement("div");
        dayNum.className = "calendar-day-num";
        dayNum.textContent = currentDate.getDate();

        // 음력 날짜 표시 추가
        if (currentDate.getMonth() === this.currentMonth) {
          const lunarDate = this.lunarCalendar.solarToLunar(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            currentDate.getDate()
          );
          if (lunarDate) {
            const lunarSpan = document.createElement("div");
            lunarSpan.className = "lunar-date";
            lunarSpan.textContent = this.lunarCalendar.formatLunar(lunarDate);
            dayNum.appendChild(lunarSpan);
          }
        }

        const isToday = currentDate.toDateString() === today.toDateString();

        if (currentDate.getMonth() !== this.currentMonth) {
          dayNum.classList.add("other-month");
        } else {
          const capturedDate = new Date(currentDate);

          cell.addEventListener("click", () => {
            // 일정이 있는지 확인
            const schedules = this.getSchedulesForDate(capturedDate);
            if (schedules.length > 0) {
              // 일정이 있으면 일일 일정 리스트 모달 표시
              this.showDailyScheduleModal(capturedDate);
            } else {
              // 일정이 없으면 바로 일정 추가 모달 표시
              this.showScheduleModal(capturedDate);
            }
          });

          if (isToday) {
            dayNum.classList.add("today");
          }
        }

        dayContainer.appendChild(dayNum);
        cell.appendChild(dayContainer);

        // 일정 목록 표시
        const schedules = this.getSchedulesForDate(currentDate);
        if (schedules.length > 0) {
          const scheduleList = document.createElement("div");
          scheduleList.className = "calendar-schedule-list";

          // 중요한 날을 먼저 표시하도록 정렬
          schedules.sort((a, b) => {
            if (a.isImportant && !b.isImportant) return -1;
            if (!a.isImportant && b.isImportant) return 1;
            if (a.isHoliday && !b.isHoliday) return -1;
            if (!a.isHoliday && b.isHoliday) return 1;
            return 0;
          });

          schedules.forEach((schedule) => {
            const scheduleItem = document.createElement("div");
            scheduleItem.className = "calendar-schedule-item";

            // 중요한 날과 휴일 스타일 적용
            if (schedule.isImportant) {
              scheduleItem.classList.add("important");
            } else if (schedule.isHoliday) {
              scheduleItem.classList.add("holiday");
            }

            // 다른 달 일정 아이템 opacity 조정
            if (currentDate.getMonth() !== this.currentMonth) {
              scheduleItem.style.opacity = "0.6";
            }

            if (schedule.startDate === schedule.endDate) {
              const titleText = this.truncateText(schedule.title, 15);
              const contentIndicator = schedule.content ? " *" : "";
              scheduleItem.textContent = `${titleText}${contentIndicator}`;
            } else {
              const dateInfo = this.getScheduleDateIndex(schedule, currentDate);
              if (dateInfo.isValid) {
                const titleText = this.truncateText(schedule.title, 10);
                const contentIndicator = schedule.content ? " *" : "";
                scheduleItem.textContent = `${titleText}${contentIndicator} (${dateInfo.currentIndex}/${dateInfo.totalCount})`;
              } else {
                const titleText = this.truncateText(schedule.title, 15);
                const contentIndicator = schedule.content ? " *" : "";
                scheduleItem.textContent = `${titleText}${contentIndicator}`;
              }
            }

            // 일정 아이템 클릭 시 상세 보기
            scheduleItem.addEventListener("click", (e) => {
              e.stopPropagation();
              this.showScheduleDetailModal(schedule);
            });

            // 호버 시 툴팁 표시
            scheduleItem.addEventListener("mouseenter", (e) => {
              this.showScheduleTooltip(e, schedule);
            });

            scheduleItem.addEventListener("mouseleave", () => {
              this.hideScheduleTooltip();
            });

            scheduleItem.addEventListener("mousemove", (e) => {
              this.updateScheduleTooltipPosition(e);
            });

            scheduleList.appendChild(scheduleItem);
          });

          cell.appendChild(scheduleList);
        }

        row.appendChild(cell);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      tbodyElement.appendChild(row);
    }
  }
  // 일정 툴팁 함수들 (개선된 버전) - 수정된 부분: 제목 100글자, 내용 200글자 제한
  showScheduleTooltip(e, schedule) {
    const existingTooltip = document.querySelector(".schedule-tooltip");
    if (existingTooltip) {
      existingTooltip.remove();
    }

    const tooltip = document.createElement("div");
    tooltip.className = "schedule-tooltip";

    // 호버 시 내용 개선 (수정된 부분: 제목 100글자, 내용 200글자 제한)
    let content = `일정: ${this.truncateText(schedule.title, 100)}`;
    if (schedule.content) {
      content += `\n내용: ${this.truncateText(schedule.content, 200)}`;
    }

    tooltip.textContent = content;
    document.body.appendChild(tooltip);

    this.updateScheduleTooltipPosition(e);
  }

  hideScheduleTooltip() {
    const tooltip = document.querySelector(".schedule-tooltip");
    if (tooltip) {
      tooltip.remove();
    }
  }

  updateScheduleTooltipPosition(e) {
    const tooltip = document.querySelector(".schedule-tooltip");
    if (!tooltip) return;

    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = e.pageX + 10;
    let top = e.pageY - 30;

    if (left + tooltipRect.width > viewportWidth) {
      left = e.pageX - tooltipRect.width - 10;
    }

    if (left < 0) {
      left = 10;
    }

    if (top < 0) {
      top = e.pageY + 20;
    }

    if (top + tooltipRect.height > viewportHeight) {
      top = e.pageY - tooltipRect.height - 10;
    }

    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
  }

  // 내용 포맷팅 함수 (20글자마다 줄바꿈)
  formatContentWithLineBreaks(content, lineLength) {
    const words = content.split("");
    let result = "";
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      currentLine += words[i];
      if (currentLine.length >= lineLength) {
        result += currentLine + "\n";
        currentLine = "";
      }
    }

    if (currentLine) {
      result += currentLine;
    }

    return result;
  }

  showAllSchedulesModal() {
    const modal = document.getElementById("allSchedulesModal");
    const searchInput = document.getElementById("scheduleSearchInput");
    const filterSelect = document.getElementById("scheduleFilterSelect");

    searchInput.value = "";
    filterSelect.value = "";
    this.currentScheduleSearch = "";
    this.currentScheduleTypeFilter = "";

    this.renderAllSchedulesList();
    modal.style.display = "flex";
  }

  hideAllSchedulesModal() {
    document.getElementById("allSchedulesModal").style.display = "none";
  }

  renderAllSchedulesList() {
    const container = document.getElementById("allSchedulesList");
    container.innerHTML = "";

    let filteredSchedules = this.schedulesData;

    // 검색 필터 적용
    if (this.currentScheduleSearch) {
      filteredSchedules = filteredSchedules.filter(
        (schedule) =>
          schedule.title
            .toLowerCase()
            .includes(this.currentScheduleSearch.toLowerCase()) ||
          (schedule.content &&
            schedule.content
              .toLowerCase()
              .includes(this.currentScheduleSearch.toLowerCase()))
      );
    }

    // 타입 필터 적용 (새로운 기능)
    if (this.currentScheduleTypeFilter) {
      filteredSchedules = filteredSchedules.filter((schedule) => {
        if (this.currentScheduleTypeFilter === "important") {
          return schedule.isImportant;
        } else if (this.currentScheduleTypeFilter === "holiday") {
          return schedule.isHoliday;
        }
        return true;
      });
    }

    if (filteredSchedules.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.innerHTML = `
                <h3>일정을 찾을 수 없습니다</h3>
                <p>${
                  this.currentScheduleSearch || this.currentScheduleTypeFilter
                    ? "다른 검색어나 필터를 시도해보세요"
                    : "첫 번째 일정을 만들어보세요"
                }</p>
            `;
      container.appendChild(emptyState);
      return;
    }

    const sortedSchedules = [...filteredSchedules].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );

    sortedSchedules.forEach((schedule) => {
      const item = document.createElement("div");
      item.className = "schedule-item";

      if (schedule.isImportant) {
        item.classList.add("important");
      } else if (schedule.isHoliday) {
        item.classList.add("holiday");
      }

      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);
      const dateText =
        schedule.startDate === schedule.endDate
          ? startDate.toLocaleDateString("ko-KR")
          : `${startDate.toLocaleDateString(
              "ko-KR"
            )} - ${endDate.toLocaleDateString("ko-KR")}`;

      // 제목과 내용 길이 제한 (40글자로 변경)
      const truncatedTitle = this.truncateText(schedule.title, 40);
      const truncatedContent = this.truncateText(schedule.content || "", 40);

      item.innerHTML = `
                <div class="schedule-item-info">
                    <div class="schedule-item-title">${truncatedTitle}</div>
                    ${
                      schedule.content
                        ? `<div class="schedule-item-content">${truncatedContent}</div>`
                        : ""
                    }
                    <div class="schedule-item-date">${dateText}</div>
                    <div class="schedule-item-created">생성일: ${this.formatDateTimeShort(
                      schedule.createdAt
                    )}</div>
                </div>
                <div class="schedule-item-controls">
                    <button class="schedule-edit-btn">편집</button>
                    <button class="schedule-delete-btn">삭제</button>
                </div>
            `;

      // 클릭 이벤트: 일정 상세 보기
      item.addEventListener("click", (e) => {
        if (
          e.target.classList.contains("schedule-edit-btn") ||
          e.target.classList.contains("schedule-delete-btn")
        )
          return;
        this.showScheduleDetailModal(schedule);
      });

      // 이벤트 리스너를 동적으로 추가
      const editBtn = item.querySelector(".schedule-edit-btn");
      const deleteBtn = item.querySelector(".schedule-delete-btn");

      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.editSchedule(schedule.id);
      });

      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteSchedule(schedule.id);
      });

      container.appendChild(item);
    });
  }

  searchSchedules() {
    const searchInput = document.getElementById("scheduleSearchInput");
    this.currentScheduleSearch = searchInput.value.trim();
    this.renderAllSchedulesList();
  }

  // 새로운 필터 기능
  filterSchedules() {
    const filterSelect = document.getElementById("scheduleFilterSelect");
    this.currentScheduleTypeFilter = filterSelect.value;
    this.renderAllSchedulesList();
  }

  editSchedule(id) {
    const schedule = this.schedulesData.find((s) => s.id === id);
    if (!schedule) return;

    this.showScheduleEditModal(schedule);
  }

  deleteSchedule(id) {
    this.showConfirmModal("일정 삭제", "이 일정을 삭제하시겠습니까?", () => {
      this.schedulesData = this.schedulesData.filter((s) => s.id !== id);
      this.saveData();
      this.renderAllSchedulesList();
      this.renderCalendar();
      if (this.currentMode === "schedule") {
        this.renderMonthlyCalendar();
      }
      // 일일 일정 모달이 열려있다면 새로고침
      if (
        document.getElementById("dailyScheduleModal").style.display === "flex"
      ) {
        this.renderDailyScheduleList(
          this.currentViewingDate,
          document.getElementById("dailyScheduleList")
        );
      }
      this.updateModeStats();
      this.updateDashboardStats();
      this.showToast("일정이 삭제되었습니다!", "success");
    });
  }

  // 투두리스트 관리
  switchTodoTab(tab) {
    this.activeTab = tab;

    const todoTab = document.getElementById("todoTabActive");
    const completedTab = document.getElementById("todoTabCompleted");
    const todoContent = document.getElementById("todoTabContent");
    const completedContent = document.getElementById("completedTabContent");

    if (tab === "todo") {
      todoTab.classList.add("active");
      completedTab.classList.remove("active");
      todoContent.style.display = "flex";
      todoContent.style.flexDirection = "column";
      completedContent.style.display = "none";
    } else {
      todoTab.classList.remove("active");
      completedTab.classList.add("active");
      todoContent.style.display = "none";
      completedContent.style.display = "flex";
      completedContent.style.flexDirection = "column";
    }

    // 통계 업데이트
    this.updateModeStats();
    this.renderCalendar();
  }

  // addTodo 함수 수정 (한국 표준시 사용)
  addTodo() {
    const input = document.getElementById("todoInput");
    const text = input.value.trim();

    if (text) {
      const now = this.getKSTDate(); // 한국 표준시 사용
      const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: this.formatDateTime(now),
        completedAt: null,
        editedAt: null,
      };
      this.todoData.push(todo);
      input.value = "";
      this.saveData();
      this.renderTodoList();
      this.renderCalendar();
      this.updateModeStats();
      this.updateDashboardStats();
      this.showToast("할 일이 생성되었습니다!", "success");
    }
  }

  renderTodoList() {
    const todoList = document.getElementById("todoList");
    const completedList = document.getElementById("completedList");
    const todoClearBtn = document.getElementById("todoClearBtn");
    const completedClearBtn = document.getElementById("completedClearBtn");

    // 필터링된 데이터 가져오기
    let filteredTodoData = this.todoData;
    let filteredCompletedData = this.completedData;

    if (this.currentTodoFilter) {
      const filterDate = this.currentTodoFilter;

      filteredTodoData = this.todoData.filter((todo) => {
        const createdDate = new Date(todo.createdAt)
          .toISOString()
          .split("T")[0];
        return createdDate === filterDate;
      });

      filteredCompletedData = this.completedData.filter((todo) => {
        if (!todo.completedAt) return false;
        const completedDate = new Date(todo.completedAt)
          .toISOString()
          .split("T")[0];
        return completedDate === filterDate;
      });
    }

    // Todo 목록 렌더링
    todoList.innerHTML = "";
    todoClearBtn.style.display = this.todoData.length > 0 ? "block" : "none";

    if (filteredTodoData.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.innerHTML = `
                <h3>할 일 없음</h3>
                <p>${
                  this.currentTodoFilter
                    ? "선택한 날짜에 할 일이 없습니다"
                    : "위에서 첫 번째 할 일을 추가해보세요"
                }</p>
            `;
      todoList.appendChild(emptyState);
    } else {
      filteredTodoData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      filteredTodoData.forEach((todo) => {
        const item = document.createElement("div");
        item.className = "todo-item";

        const timestampHtml = todo.editedAt
          ? `<div class="todo-timestamp">생성일: ${todo.createdAt}<br>수정일: ${todo.editedAt}</div>`
          : `<div class="todo-timestamp">생성일: ${todo.createdAt}</div>`;

        const isEditing = this.currentTodoEditId === todo.id;

        item.innerHTML = `
                    <div class="todo-item-content">
                        <textarea class="todo-text ${
                          isEditing ? "editing" : ""
                        }" ${isEditing ? "" : "readonly"}>${
          todo.text
        }</textarea>
                        ${timestampHtml}
                    </div>
                    <div class="todo-controls">
                        <button class="todo-btn ${
                          isEditing ? "complete" : "edit"
                        }" onclick="attendanceChecker.toggleTodoEdit(${
          todo.id
        }, this)">${isEditing ? "저장" : "편집"}</button>
                        <button class="todo-btn complete" onclick="attendanceChecker.completeTodo(${
                          todo.id
                        })">완료</button>
                        <button class="todo-btn delete" onclick="attendanceChecker.deleteTodo(${
                          todo.id
                        })">삭제</button>
                    </div>
                `;
        todoList.appendChild(item);

        // 편집 모드일 때 포커스 유지
        if (isEditing) {
          setTimeout(() => {
            const textArea = item.querySelector(".todo-text");
            textArea.focus();
            textArea.setSelectionRange(
              textArea.value.length,
              textArea.value.length
            );
          }, 0);
        }
      });
    }

    // Completed 목록 렌더링 - 수정된 부분 (시간 순서 변경: Completed → Edited → Created)
    completedList.innerHTML = "";
    completedClearBtn.style.display =
      this.completedData.length > 0 ? "block" : "none";

    if (filteredCompletedData.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.innerHTML = `
                <h3>완료된 할 일 없음</h3>
                <p>${
                  this.currentTodoFilter
                    ? "선택한 날짜에 완료된 할 일이 없습니다"
                    : "할 일을 완료하면 여기에 표시됩니다"
                }</p>
            `;
      completedList.appendChild(emptyState);
    } else {
      filteredCompletedData.sort((a, b) => {
        if (!a.completedAt || !b.completedAt) return 0;
        return new Date(b.completedAt) - new Date(a.completedAt);
      });

      filteredCompletedData.forEach((todo) => {
        const item = document.createElement("div");
        item.className = "todo-item completed";

        // 수정된 부분: 시간 순서를 completed, edited, created로 변경
        let timestampHtml = `<div class="todo-timestamp">`;
        if (todo.completedAt) {
          timestampHtml += `완료일: ${todo.completedAt}`;
        }
        if (todo.editedAt) {
          timestampHtml += `<br>수정일: ${todo.editedAt}`;
        }
        timestampHtml += `<br>생성일: ${todo.createdAt}`;
        timestampHtml += `</div>`;

        item.innerHTML = `
                    <div class="todo-item-content">
                        <div class="todo-text">${todo.text}</div>
                        ${timestampHtml}
                    </div>
                    <div class="todo-controls">
                        <button class="todo-btn edit" onclick="attendanceChecker.restoreTodo(${todo.id})">복원</button>
                        <button class="todo-btn delete" onclick="attendanceChecker.deleteTodo(${todo.id}, true)">삭제</button>
                    </div>
                `;
        completedList.appendChild(item);
      });
    }
  }
  // editTodo 함수 내 toggleTodoEdit 함수 수정 (한국 표준시 사용)
  toggleTodoEdit(id, element) {
    if (this.currentTodoEditId === id) {
      // 저장 모드
      const todo = this.todoData.find((t) => t.id === id);
      if (todo) {
        const textElement =
          element.parentElement.parentElement.querySelector(".todo-text");
        const newText = textElement.value.trim();
        if (newText && todo.text !== newText) {
          todo.text = newText;
          todo.editedAt = this.formatDateTime(this.getKSTDate()); // 한국 표준시 사용
          this.saveData();
          this.showToast("할 일이 수정되었습니다!", "success");
        }
      }
      this.currentTodoEditId = null;
    } else {
      // 편집 모드로 전환
      this.currentTodoEditId = id;
    }
    this.renderTodoList();
  }

  editTodo(id, newText) {
    const todo = this.todoData.find((t) => t.id === id);
    if (todo && todo.text !== newText) {
      todo.text = newText;
      todo.editedAt = this.formatDateTime(new Date());
      this.saveData();
    }
  }

  // completeTodo 함수 수정 (한국 표준시 사용)
  completeTodo(id) {
    const todoIndex = this.todoData.findIndex((t) => t.id === id);
    if (todoIndex !== -1) {
      const todo = this.todoData.splice(todoIndex, 1)[0];
      todo.completed = true;
      todo.completedAt = this.formatDateTime(this.getKSTDate()); // 한국 표준시 사용
      this.completedData.push(todo);
      this.currentTodoEditId = null; // 편집 상태 해제
      this.saveData();
      this.renderTodoList();
      this.renderCalendar();
      this.updateModeStats();
      this.updateDashboardStats();
      this.showToast("할 일이 완료되었습니다!", "success");
    }
  }

  restoreTodo(id) {
    const completedIndex = this.completedData.findIndex((t) => t.id === id);
    if (completedIndex !== -1) {
      const todo = this.completedData.splice(completedIndex, 1)[0];
      todo.completed = false;
      todo.completedAt = null;
      this.todoData.push(todo);
      this.saveData();
      this.renderTodoList();
      this.renderCalendar();
      this.updateModeStats();
      this.updateDashboardStats();
      this.showToast("할 일이 복원되었습니다!", "success");
    }
  }

  deleteTodo(id, isCompleted = false) {
    this.showConfirmModal("할 일 삭제", "이 할 일을 삭제하시겠습니까?", () => {
      if (isCompleted) {
        this.completedData = this.completedData.filter((t) => t.id !== id);
      } else {
        this.todoData = this.todoData.filter((t) => t.id !== id);
        if (this.currentTodoEditId === id) {
          this.currentTodoEditId = null;
        }
      }
      this.saveData();
      this.renderTodoList();
      this.renderCalendar();
      this.updateModeStats();
      this.updateDashboardStats();
      this.showToast("할 일이 삭제되었습니다!", "success");
    });
  }

  getTodosCreatedOnDate(date) {
    const dateStr = this.getDateKey(date);
    return this.todoData.filter((todo) => {
      const createdDate = new Date(todo.createdAt).toISOString().split("T")[0];
      return createdDate === dateStr;
    });
  }

  getTodosCompletedOnDate(date) {
    const dateStr = this.getDateKey(date);
    return this.completedData.filter((todo) => {
      if (!todo.completedAt) return false;
      const completedDate = new Date(todo.completedAt)
        .toISOString()
        .split("T")[0];
      return completedDate === dateStr;
    });
  }

  // 메모 관리
  showMemoModal(memoId = null) {
    const modal = document.getElementById("memoModal");
    const titleInput = document.getElementById("memoTitleInput");
    const contentInput = document.getElementById("memoContentInput");
    const timestampDiv = document.getElementById("memoTimestamp");
    const editBtn = document.getElementById("memoModalEdit");
    const confirmBtn = document.getElementById("memoModalConfirm");

    this.currentEditingMemo = memoId;
    this.memoEditMode = false; // 편집 모드 상태 추가
    this.originalMemoData = null; // 원본 데이터 저장용

    if (memoId) {
      const memo = this.memoData.find((m) => m.id === memoId);
      if (memo) {
        // 원본 데이터 백업
        this.originalMemoData = {
          title: memo.title,
          content: memo.content,
        };

        titleInput.value = memo.title;
        contentInput.value = memo.content;
        contentInput.readOnly = true;
        titleInput.readOnly = true;

        const timestampHtml = memo.editedAt
          ? `생성일: ${this.formatDateTimeShort(
              memo.createdAt
            )}<br>수정일: ${this.formatDateTimeShort(memo.editedAt)}`
          : `생성일: ${this.formatDateTimeShort(memo.createdAt)}`;
        timestampDiv.innerHTML = timestampHtml;

        editBtn.style.display = "inline-block";
        editBtn.textContent = "편집";
        confirmBtn.style.display = "none"; // 기존 메모 보기 시 아래쪽 Save 버튼 숨김
      }
    } else {
      // 새 메모 생성 시에만 아래쪽 Save 버튼 표시
      const nextNumber = this.memoData.length + 1;
      titleInput.value = `메모 ${nextNumber}`;
      contentInput.value = "";
      contentInput.readOnly = false;
      titleInput.readOnly = false;
      timestampDiv.innerHTML = "";

      editBtn.style.display = "none";
      confirmBtn.style.display = "inline-block"; // 새 메모 시에만 아래쪽 Save 표시
      this.memoEditMode = false;
      this.originalMemoData = null;

      setTimeout(() => {
        titleInput.focus();
        titleInput.select();
      }, 100);
    }

    modal.style.display = "flex";
  }

  hideMemoModal() {
    // 편집 모드에서 닫으려고 할 때 확인
    if (this.memoEditMode && this.hasUnsavedMemoChanges()) {
      this.showMemoCloseConfirm();
      return;
    }

    this.closeMemoModal();
  }

  // 새로운 함수: 메모 모달 닫기 확인
  showMemoCloseConfirm() {
    this.showConfirmModal(
      "저장되지 않은 변경사항",
      "저장하지 않고 닫으시겠습니까?",
      () => {
        this.revertMemoChanges();
        this.closeMemoModal();
      }
    );
  }

  // 새로운 함수: 메모 변경사항 되돌리기
  revertMemoChanges() {
    if (this.originalMemoData) {
      const titleInput = document.getElementById("memoTitleInput");
      const contentInput = document.getElementById("memoContentInput");
      const editBtn = document.getElementById("memoModalEdit");
      const confirmBtn = document.getElementById("memoModalConfirm");

      titleInput.value = this.originalMemoData.title;
      contentInput.value = this.originalMemoData.content;
      titleInput.readOnly = true;
      contentInput.readOnly = true;
      editBtn.textContent = "편집";
      confirmBtn.style.display = "none"; // 되돌릴 때도 아래쪽 Save 숨김
      this.memoEditMode = false;
    }
  }

  // 새로운 함수: 실제 메모 모달 닫기
  closeMemoModal() {
    document.getElementById("memoModal").style.display = "none";
    this.currentEditingMemo = null;
    this.memoEditMode = false;
    this.originalMemoData = null;
  }

  // 새로운 함수: 저장되지 않은 변경사항 확인
  hasUnsavedMemoChanges() {
    if (!this.originalMemoData) return false;

    const titleInput = document.getElementById("memoTitleInput");
    const contentInput = document.getElementById("memoContentInput");

    return (
      titleInput.value !== this.originalMemoData.title ||
      contentInput.value !== this.originalMemoData.content
    );
  }

  toggleMemoEdit() {
    const titleInput = document.getElementById("memoTitleInput");
    const contentInput = document.getElementById("memoContentInput");
    const editBtn = document.getElementById("memoModalEdit");
    const confirmBtn = document.getElementById("memoModalConfirm");

    if (!this.memoEditMode) {
      // 편집 모드 시작
      titleInput.readOnly = false;
      contentInput.readOnly = false;
      contentInput.focus();
      editBtn.textContent = "저장";
      confirmBtn.style.display = "none"; // 아래쪽 Save 버튼 숨기기
      this.memoEditMode = true;
    } else {
      // 저장 모드
      this.saveMemoEdit();
      titleInput.readOnly = true;
      contentInput.readOnly = true;
      editBtn.textContent = "편집";
      confirmBtn.style.display = "none"; // 아래쪽 Save 버튼 계속 숨김
      this.memoEditMode = false;
    }
  }

  // saveMemoEdit 함수 수정 (한국 표준시 사용)
  saveMemoEdit() {
    if (!this.currentEditingMemo) return;

    const titleInput = document.getElementById("memoTitleInput");
    const contentInput = document.getElementById("memoContentInput");
    const timestampDiv = document.getElementById("memoTimestamp");

    const memo = this.memoData.find((m) => m.id === this.currentEditingMemo);
    if (memo) {
      memo.title = titleInput.value.trim() || memo.title;
      memo.content = contentInput.value.trim();
      memo.editedAt = this.formatDateTime(this.getKSTDate()); // 한국 표준시 사용

      const timestampHtml = `생성일: ${this.formatDateTimeShort(
        memo.createdAt
      )}<br>수정일: ${this.formatDateTimeShort(memo.editedAt)}`;
      timestampDiv.innerHTML = timestampHtml;

      this.saveData();
      this.renderMemoList();
      this.renderCalendar();
      this.showToast("메모가 수정되었습니다!", "success");
    }
  }

  // confirmMemoModal 함수 수정 (한국 표준시 사용)
  confirmMemoModal() {
    const titleInput = document.getElementById("memoTitleInput");
    const contentInput = document.getElementById("memoContentInput");

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!content) {
      this.showToast("메모 내용을 입력해주세요.", "error");
      return;
    }

    if (this.currentEditingMemo) {
      this.saveMemoEdit();
    } else {
      const now = this.getKSTDate(); // 한국 표준시 사용
      const memo = {
        id: Date.now(),
        title: title || `메모 ${this.memoData.length + 1}`,
        content: content,
        createdAt: this.formatDateTime(now),
        editedAt: null,
      };
      this.memoData.push(memo);
      this.saveData();
      this.renderMemoList();
      this.renderCalendar();
      this.updateModeStats();
      this.updateDashboardStats();
      this.showToast("메모가 생성되었습니다!", "success");
    }

    this.hideMemoModal();
  }

  searchMemos() {
    const searchInput = document.getElementById("memoSearchInput");
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm) {
      this.currentMemoSearch = searchTerm;
      document.getElementById("memoClearSearchBtn").style.display =
        "inline-block";
    } else {
      this.currentMemoSearch = "";
      document.getElementById("memoClearSearchBtn").style.display = "none";
    }

    this.renderMemoList();
  }

  clearMemoSearch() {
    document.getElementById("memoSearchInput").value = "";
    this.currentMemoSearch = "";
    document.getElementById("memoClearSearchBtn").style.display = "none";
    this.renderMemoList();
  }

  renderMemoList() {
    const memoList = document.getElementById("memoList");
    const memoClearBtn = document.getElementById("memoClearBtn");

    if (!memoList) {
      console.error("memoList element not found");
      return;
    }

    memoList.innerHTML = "";

    // 데이터 타입 확인
    if (!Array.isArray(this.memoData)) {
      console.error("memoData is not an array:", typeof this.memoData);
      this.memoData = [];
    }

    let filteredMemos = [...this.memoData];

    if (this.currentMemoFilter) {
      const filterDate = this.currentMemoFilter;
      filteredMemos = this.memoData.filter((memo) => {
        if (!memo || !memo.createdAt) return false;
        const createdDate = new Date(memo.createdAt)
          .toISOString()
          .split("T")[0];
        return createdDate === filterDate;
      });
    } else if (this.currentMemoSearch) {
      filteredMemos = this.memoData.filter((memo) => {
        if (!memo || !memo.title || !memo.content) return false;
        return (
          memo.title.toLowerCase().includes(this.currentMemoSearch) ||
          memo.content.toLowerCase().includes(this.currentMemoSearch)
        );
      });
    }

    if (memoClearBtn) {
      memoClearBtn.style.display = this.memoData.length > 0 ? "block" : "none";
    }

    if (filteredMemos.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";

      if (this.currentMemoSearch) {
        emptyState.innerHTML = `
                    <h3>메모를 찾을 수 없습니다</h3>
                    <p>"${this.currentMemoSearch}"에 대한 메모를 찾을 수 없습니다</p>
                `;
      } else if (this.currentMemoFilter) {
        emptyState.innerHTML = `
                    <h3>메모를 찾을 수 없습니다</h3>
                    <p>선택한 날짜에 메모가 없습니다</p>
                `;
      } else {
        emptyState.innerHTML = `
                    <h3>메모가 없습니다</h3>
                    <p>첫 번째 메모를 만들어보세요!</p>
                `;
      }
      memoList.appendChild(emptyState);
    } else {
      // 정렬 - 최신순
      filteredMemos.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      filteredMemos.forEach((memo) => {
        if (!memo || !memo.id) return;

        const item = document.createElement("div");
        item.className = "memo-item";

        const timestampHtml = memo.editedAt
          ? `생성일: ${this.formatDateTimeShort(
              memo.createdAt
            )}<br>수정일: ${this.formatDateTimeShort(memo.editedAt)}`
          : `생성일: ${this.formatDateTimeShort(memo.createdAt)}`;

        const preview =
          memo.content && memo.content.length > 100
            ? memo.content.substring(0, 100) + "..."
            : memo.content || "";

        let highlightedTitle = memo.title || "제목 없음";
        let highlightedPreview = preview;

        if (this.currentMemoSearch) {
          const regex = new RegExp(`(${this.currentMemoSearch})`, "gi");
          highlightedTitle = highlightedTitle.replace(
            regex,
            '<span style="background: rgba(255, 255, 0, 0.3);">$1</span>'
          );
          highlightedPreview = highlightedPreview.replace(
            regex,
            '<span style="background: rgba(255, 255, 0, 0.3);">$1</span>'
          );
        }

        // 아이템 구조를 todo/counter와 동일하게 변경 (클래스명 수정)
        item.innerHTML = `
                    <div class="memo-item-content">
                        <div class="memo-title">${highlightedTitle}</div>
                        <div class="memo-preview">${highlightedPreview}</div>
                        <div class="memo-timestamp">${timestampHtml}</div>
                    </div>
                    <div class="memo-item-controls">
                        <button class="memo-btn delete" onclick="attendanceChecker.deleteMemo(${memo.id})">삭제</button>
                    </div>
                `;

        item.addEventListener("click", (e) => {
          if (e.target.classList.contains("memo-btn")) return;
          this.showMemoModal(memo.id);
        });

        memoList.appendChild(item);
      });
    }
  }
  deleteMemo(id) {
    this.showConfirmModal("메모 삭제", "이 메모를 삭제하시겠습니까?", () => {
      this.memoData = this.memoData.filter((m) => m.id !== id);
      this.saveData();
      this.renderMemoList();
      this.renderCalendar();
      this.updateModeStats();
      this.updateDashboardStats();
      this.showToast("메모가 삭제되었습니다!", "success");
    });
  }

  getMemosCreatedOnDate(date) {
    const dateStr = this.getDateKey(date);

    // 데이터 타입 확인
    if (!Array.isArray(this.memoData)) {
      console.warn("memoData is not an array in getMemosCreatedOnDate");
      return [];
    }

    return this.memoData.filter((memo) => {
      if (!memo || !memo.createdAt) return false;
      try {
        const createdDate = new Date(memo.createdAt)
          .toISOString()
          .split("T")[0];
        return createdDate === dateStr;
      } catch (error) {
        console.error("Error parsing memo date:", error);
        return false;
      }
    });
  }

  // Day Counter 관리
  showCounterModal(counterId = null) {
    const modal = document.getElementById("counterModal");
    const title = document.getElementById("counterModalTitle");
    const titleInput = document.getElementById("counterTitle");
    const dateInput = document.getElementById("counterDate");
    const confirmBtn = document.getElementById("counterModalConfirm");

    this.currentEditingCounter = counterId;

    if (counterId) {
      const counter = this.counterData.find((c) => c.id === counterId);
      if (counter) {
        title.textContent = "디데이 카운터 편집";
        titleInput.value = counter.title;
        dateInput.value = counter.targetDate;
        confirmBtn.textContent = "수정";
      }
    } else {
      title.textContent = "디데이 카운터 생성";
      titleInput.value = "";
      dateInput.value = new Date().toISOString().split("T")[0];
      confirmBtn.textContent = "생성";

      setTimeout(() => {
        titleInput.focus();
      }, 100);
    }

    modal.style.display = "flex";
  }

  hideCounterModal() {
    document.getElementById("counterModal").style.display = "none";
    this.currentEditingCounter = null;
  }

  // confirmCounterModal 함수 수정 (한국 표준시 사용)
  confirmCounterModal() {
    const titleInput = document.getElementById("counterTitle");
    const dateInput = document.getElementById("counterDate");

    const title = titleInput.value.trim();
    const targetDate = dateInput.value;

    if (!title || !targetDate) {
      this.showToast("제목과 목표일을 모두 입력해주세요.", "error");
      return;
    }

    if (this.currentEditingCounter) {
      const counter = this.counterData.find(
        (c) => c.id === this.currentEditingCounter
      );
      if (counter) {
        counter.title = title;
        counter.targetDate = targetDate;
        counter.editedAt = this.formatDateTime(this.getKSTDate()); // 한국 표준시 사용
        this.showToast("카운터가 수정되었습니다!", "success");
      }
    } else {
      const now = this.getKSTDate(); // 한국 표준시 사용
      const counter = {
        id: Date.now(),
        title: title,
        targetDate: targetDate,
        createdAt: this.formatDateTime(now),
        editedAt: null,
      };
      this.counterData.push(counter);
      this.showToast("카운터가 생성되었습니다!", "success");
    }

    this.saveData();
    this.renderCounterList();
    this.renderCalendar();
    this.updateModeStats();
    this.updateDashboardStats();
    this.hideCounterModal();
  }

  renderCounterList() {
    const counterList = document.getElementById("counterList");
    const counterClearBtn = document.getElementById("counterClearBtn");

    counterList.innerHTML = "";

    let filteredCounters = this.counterData;

    if (this.currentCounterFilter) {
      const filterDate = this.currentCounterFilter;
      filteredCounters = this.counterData.filter((counter) => {
        return counter.targetDate === filterDate;
      });
    }

    counterClearBtn.style.display =
      this.counterData.length > 0 ? "block" : "none";

    if (filteredCounters.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";

      if (this.currentCounterFilter) {
        emptyState.innerHTML = `
                    <h3>디데이 카운터를 찾을 수 없습니다</h3>
                    <p>선택한 날짜에 디데이 카운터가 없습니다</p>
                `;
      } else {
        emptyState.innerHTML = `
                    <h3>디데이 카운터가 없습니다</h3>
                    <p>중요한 날짜를 추적할 첫 번째 디데이 카운터를 만들어보세요!</p>
                `;
      }
      counterList.appendChild(emptyState);
    } else {
      filteredCounters.sort((a, b) => {
        const aDays = Math.abs(this.calculateDaysDifference(a.targetDate));
        const bDays = Math.abs(this.calculateDaysDifference(b.targetDate));
        return aDays - bDays;
      });

      filteredCounters.forEach((counter) => {
        const item = document.createElement("div");
        item.className = "counter-item";

        const daysDiff = this.calculateDaysDifference(counter.targetDate);
        const daysText = this.formatDaysText(daysDiff);

        let daysClass = "future";
        let statusIcon = "🔮";

        if (daysDiff === 0) {
          daysClass = "today";
          statusIcon = "🎯";
          item.classList.add("today");
        } else if (daysDiff < 0) {
          daysClass = "past";
          statusIcon = "📅";
        } else {
          if (daysDiff <= 3) {
            daysClass = "urgent";
            statusIcon = "⚠️";
          }
        }

        const targetDate = new Date(counter.targetDate);
        const dateText = targetDate.toLocaleDateString("ko-KR");

        item.innerHTML = `
                    <div class="counter-info">
                        <div class="counter-title">${counter.title}</div>
                        <div class="counter-date">${dateText}</div>
                        <div class="counter-days ${daysClass}">
                            ${daysText}
                            <span class="counter-status-icon">${statusIcon}</span>
                        </div>
                    </div>
                    <div class="counter-item-controls">
                        <button class="counter-btn edit" onclick="attendanceChecker.editCounter(${counter.id})">편집</button>
                        <button class="counter-btn delete" onclick="attendanceChecker.deleteCounter(${counter.id})">삭제</button>
                    </div>
                `;

        counterList.appendChild(item);
      });
    }
  }

  calculateDaysDifference(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  formatDaysText(days) {
    if (days === 0) {
      return "오늘";
    } else if (days > 0) {
      return `-${days}일 남음`;
    } else {
      return `+${Math.abs(days)}일 지남`;
    }
  }

  editCounter(id) {
    this.showCounterModal(id);
  }

  deleteCounter(id) {
    this.showConfirmModal(
      "디데이 카운터 삭제",
      "이 디데이 카운터를 삭제하시겠습니까?",
      () => {
        this.counterData = this.counterData.filter((c) => c.id !== id);
        this.saveData();
        this.renderCounterList();
        this.renderCalendar();
        this.updateModeStats();
        this.updateDashboardStats();
        this.showToast("카운터가 삭제되었습니다!", "success");
      }
    );
  }

  getCountersForDate(date) {
    const dateStr = this.getDateKey(date);
    return this.counterData.filter((counter) => {
      return counter.targetDate === dateStr;
    });
  }

  // 필터 관리
  setTodoFilter(dateKey) {
    this.currentTodoFilter = dateKey;
    this.showTodoFilter(dateKey);
  }

  setMemoFilter(dateKey) {
    this.currentMemoFilter = dateKey;
    this.showMemoFilter(dateKey);
  }

  setCounterFilter(dateKey) {
    this.currentCounterFilter = dateKey;
    this.showCounterFilter(dateKey);
  }

  showTodoFilter(dateKey) {
    const filterDisplay = document.getElementById("todoFilterDisplay");
    const filterText = document.getElementById("todoFilterText");

    const date = new Date(dateKey);
    const formattedDate = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    filterText.textContent = formattedDate;
    filterDisplay.style.display = "flex";

    this.renderTodoList();
  }

  showMemoFilter(dateKey) {
    const filterDisplay = document.getElementById("memoFilterDisplay");
    const filterText = document.getElementById("memoFilterText");

    const date = new Date(dateKey);
    const formattedDate = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    filterText.textContent = formattedDate;
    filterDisplay.style.display = "flex";

    this.renderMemoList();
  }

  showCounterFilter(dateKey) {
    const filterDisplay = document.getElementById("counterFilterDisplay");
    const filterText = document.getElementById("counterFilterText");

    const date = new Date(dateKey);
    const formattedDate = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    filterText.textContent = formattedDate;
    filterDisplay.style.display = "flex";

    this.renderCounterList();
  }

  clearTodoFilter() {
    this.currentTodoFilter = null;
    document.getElementById("todoFilterDisplay").style.display = "none";
    this.renderTodoList();
  }

  clearMemoFilter() {
    this.currentMemoFilter = null;
    document.getElementById("memoFilterDisplay").style.display = "none";
    this.renderMemoList();
  }

  clearCounterFilter() {
    this.currentCounterFilter = null;
    document.getElementById("counterFilterDisplay").style.display = "none";
    this.renderCounterList();
  }

  clearScheduleFilter() {
    this.currentScheduleFilter = null;
    document.getElementById("scheduleFilterDisplay").style.display = "none";
    if (this.currentMode === "schedule") {
      this.renderMonthlyCalendar();
    }
  }

  // 전체 삭제 기능
  confirmClearAll(type) {
    let confirmMessage = "";
    switch (type) {
      case "attendance":
        confirmMessage = "모든 데이 로그를 삭제하시겠습니까?";
        break;
      case "schedules":
        confirmMessage = "모든 일정을 삭제하시겠습니까?";
        break;
      case "todo":
        confirmMessage = "모든 할 일을 삭제하시겠습니까?";
        break;
      case "completed":
        confirmMessage = "모든 완료된 항목을 삭제하시겠습니까?";
        break;
      case "memo":
        confirmMessage = "모든 메모를 삭제하시겠습니까?";
        break;
      case "counter":
        confirmMessage = "모든 디데이 카운터를 삭제하시겠습니까?";
        break;
    }

    this.showConfirmModal("전체 항목 삭제", confirmMessage, () => {
      switch (type) {
        case "attendance":
          this.clearAllAttendance();
          break;
        case "schedules":
          this.clearAllSchedules();
          break;
        case "todo":
          this.clearAllTodos();
          break;
        case "completed":
          this.clearAllCompleted();
          break;
        case "memo":
          this.clearAllMemos();
          break;
        case "counter":
          this.clearAllCounters();
          break;
      }
    });
  }

  clearAllAttendance() {
    this.attendanceData = {};
    this.attendanceLog = [];
    this.saveData();
    this.renderAttendanceLog();
    this.renderCalendar();
    this.updateDashboardStats();
    this.updateModeStats();
    this.showToast("모든 데이 로그가 삭제되었습니다!", "success");
  }

  clearAllSchedules() {
    this.schedulesData = [];
    this.saveData();
    this.renderCalendar();
    if (this.currentMode === "schedule") {
      this.renderMonthlyCalendar();
    }
    if (
      document.getElementById("allSchedulesModal").style.display === "block"
    ) {
      this.renderAllSchedulesList();
    }
    // 일일 일정 모달이 열려있다면 새로고침
    if (
      document.getElementById("dailyScheduleModal").style.display === "flex"
    ) {
      this.renderDailyScheduleList(
        this.currentViewingDate,
        document.getElementById("dailyScheduleList")
      );
    }
    this.updateModeStats();
    this.updateDashboardStats();
    this.showToast("모든 일정이 삭제되었습니다!", "success");
  }

  clearAllTodos() {
    this.todoData = [];
    this.currentTodoEditId = null;
    this.saveData();
    this.renderTodoList();
    this.renderCalendar();
    this.updateModeStats();
    this.updateDashboardStats();
    this.showToast("모든 할 일이 삭제되었습니다!", "success");
  }

  clearAllCompleted() {
    this.completedData = [];
    this.saveData();
    this.renderTodoList();
    this.renderCalendar();
    this.updateModeStats();
    this.updateDashboardStats();
    this.showToast("모든 완료된 항목이 삭제되었습니다!", "success");
  }

  clearAllMemos() {
    this.memoData = [];
    this.saveData();
    this.renderMemoList();
    this.renderCalendar();
    this.updateModeStats();
    this.updateDashboardStats();
    this.showToast("모든 메모가 삭제되었습니다!", "success");
  }

  clearAllCounters() {
    this.counterData = [];
    this.saveData();
    this.renderCounterList();
    this.renderCalendar();
    this.updateModeStats();
    this.updateDashboardStats();
    this.showToast("모든 카운터가 삭제되었습니다!", "success");
  }

  exportData() {
    const allData = {
      attendanceData: this.attendanceData,
      attendanceLog: this.attendanceLog,
      schedulesData: this.schedulesData,
      todoData: this.todoData,
      completedData: this.completedData,
      memoData: this.memoData,
      counterData: this.counterData,
      quotes: this.quotes,
      welcomeMessages: this.welcomeMessages,
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vitae_data_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast("데이터를 내보냈습니다!", "success");
  }

  importData(event) {
    const file = event.target.files[0];
    if (!file) {
      this.showToast("파일을 선택하지 않았습니다.", "error");
      return;
    }

    // 파일 확장자 및 크기 확인 (10MB 제한)
    if (!file.name.endsWith(".json")) {
      this.showToast("JSON 파일만 업로드 가능합니다.", "error");
      event.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.showToast("파일 크기가 너무 큽니다. (최대 10MB)", "error");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        // 데이터 구조 검증
        if (!importedData || typeof importedData !== "object") {
          throw new Error("잘못된 데이터 형식입니다.");
        }

        // 필수 데이터 필드 확인
        const expectedFields = [
          "attendanceData",
          "attendanceLog",
          "schedulesData",
          "todoData",
          "completedData",
          "memoData",
          "counterData",
          "quotes",
          "welcomeMessages",
        ];
        const missingFields = expectedFields.filter(
          (field) => !(field in importedData)
        );
        if (missingFields.length > 0) {
          console.warn("Missing fields in imported data:", missingFields);
          missingFields.forEach((field) => {
            importedData[field] = Array.isArray(importedData[field]) ? [] : {};
          });
        }

        // schedulesData의 validDates 최적화 (연도 범위 제한)
        if (Array.isArray(importedData.schedulesData)) {
          importedData.schedulesData = importedData.schedulesData.map(
            (schedule) => {
              if (schedule.validDates && Array.isArray(schedule.validDates)) {
                schedule.validDates = schedule.validDates.filter((date) => {
                  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                  if (!match) return false;
                  const year = parseInt(match[1], 10);
                  return year >= 1960 && year <= 2050; // LunarCalendar 범위
                });
                // 최대 21년치(2015~2035)로 제한
                if (schedule.isLunar) {
                  const currentYear = this.currentYear;
                  const startYear = Math.max(1960, currentYear - 10);
                  const endYear = Math.min(2050, currentYear + 10);
                  schedule.validDates = schedule.validDates.filter((date) => {
                    const year = parseInt(date.split("-")[0], 10);
                    return year >= startYear && year <= endYear;
                  });
                }
              }
              return schedule;
            }
          );
        }

        // 데이터 할당
        this.attendanceData = importedData.attendanceData || {};
        this.attendanceLog = Array.isArray(importedData.attendanceLog)
          ? importedData.attendanceLog
          : [];
        this.schedulesData = Array.isArray(importedData.schedulesData)
          ? importedData.schedulesData
          : [];
        this.todoData = Array.isArray(importedData.todoData)
          ? importedData.todoData
          : [];
        this.completedData = Array.isArray(importedData.completedData)
          ? importedData.completedData
          : [];
        this.memoData = Array.isArray(importedData.memoData)
          ? importedData.memoData
          : [];
        this.counterData = Array.isArray(importedData.counterData)
          ? importedData.counterData
          : [];
        this.quotes = Array.isArray(importedData.quotes)
          ? importedData.quotes
          : this.quotes;
        this.welcomeMessages = Array.isArray(importedData.welcomeMessages)
          ? importedData.welcomeMessages
          : this.welcomeMessages;

        // 데이터 저장 및 UI 새로고침
        this.saveData();
        this.renderAll();
        this.showToast("데이터를 불러왔습니다!", "success");
      } catch (error) {
        console.error("Import error:", error.message, error.stack);
        console.log(
          "File content (first 500 chars):",
          e.target.result.substring(0, 500)
        );
        this.showToast(
          `데이터 불러오기에 실패했습니다: ${error.message}`,
          "error"
        );
      }
    };
    reader.onerror = () => {
      console.error("File read error");
      this.showToast("파일을 읽는 중 오류가 발생했습니다.", "error");
    };
    reader.readAsText(file);

    // 파일 입력 초기화
    event.target.value = "";
  }
  renderAll() {
    this.renderCalendar();
    this.renderAttendanceLog();
    if (this.currentMode === "schedule") {
      this.renderMonthlyCalendar();
    }
    this.renderTodoList();
    this.renderMemoList();
    this.renderCounterList();
    this.updateDashboardStats();
    this.updateModeStats();
    if (
      document.getElementById("allSchedulesModal")?.style.display === "block"
    ) {
      this.renderAllSchedulesList();
    }

    // 필터 표시 업데이트 (존재 여부 확인)
    const todoFilterDisplay = document.getElementById("todoFilterDisplay");
    const memoFilterDisplay = document.getElementById("memoFilterDisplay");
    const counterFilterDisplay = document.getElementById(
      "counterFilterDisplay"
    );

    if (this.currentTodoFilter && todoFilterDisplay) {
      this.showTodoFilter(this.currentTodoFilter);
    } else if (todoFilterDisplay) {
      todoFilterDisplay.style.display = "none";
    }

    if (this.currentMemoFilter && memoFilterDisplay) {
      this.showMemoFilter(this.currentMemoFilter);
    } else if (memoFilterDisplay) {
      memoFilterDisplay.style.display = "none";
    }

    if (this.currentCounterFilter && counterFilterDisplay) {
      this.showCounterFilter(this.currentCounterFilter);
    } else if (counterFilterDisplay) {
      counterFilterDisplay.style.display = "none";
    }

    if (
      document.getElementById("dailyScheduleModal")?.style.display === "flex"
    ) {
      this.renderDailyScheduleList(
        this.currentViewingDate,
        document.getElementById("dailyScheduleList")
      );
    }
  }
}

// 전역 인스턴스 생성 및 초기화
let attendanceChecker;

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded");
});
console.log("DOM Content Loaded");