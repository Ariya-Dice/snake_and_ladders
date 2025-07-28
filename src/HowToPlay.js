import React, { forwardRef, useState } from 'react';

const HowToPlay = forwardRef(({ onClose }, ref) => {
    const [language, setLanguage] = useState('en'); // Language state

    const englishContent = (
        <>
            <h2 className="en" style={{ textAlign: 'left', color: 'red', fontFamily: 'Changa-Medium' }}>User Guide for Snakes and Ladders</h2>
            <p className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
                The Snakes and Ladders game is an exciting and competitive game that is played online using smart contracts on the blockchain. In this game, players roll dice and move across the game board in an effort to reach the finish line. This game is entirely based on chance, and the rules and gameplay are detailed below.
				The game is set up for the BNB Testnet. You need to acquire some TBNB (faucet) from the address (https://www.bnbchain.org/en/testnet-faucet).

All funds you send to the game are under the complete control of the smart contract on the blockchain. No one has access to them. All calculations and payments are performed by the smart contract.

The first 5,000 participants will receive special game tokens as rewards in the future.
            </p>
            <h3 className="en" style={{ textAlign: 'left', color: 'red', fontFamily: 'Changa-Medium' }}>Game Rules</h3>
            <h3 className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>Joining the Game:</h3>
            <p className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
                - To join the game, each player must pay an entry fee of 0.004 BNB.<br />
                - The maximum number of players allowed in each game is 1000.<br />
                - If the number of active players reaches the maximum, inactive players will be removed.<br />
                - To join the game, you must install a crypto wallet (such as MetaMask, Trust Wallet, etc.).<br />
                - To join the game on Android and iOS devices, you can enter www.lottoariya.xyz in your wallet’s internal browser and participate in the game.<br />
                - You need to have approximately 0.006 BNB in your wallet to be able to participate in the game and cover the transaction fees.
            </p>
            <h3 className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>Moving in the Game:</h3>
            <p className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
                - The random number generation for the dice is executed by two separate systems (in the application and the smart contract), ensuring randomness to the greatest extent possible. Each player moves by rolling a die (a random number between 1 and 6).<br />
                - Players play individually, and there are no turns for rolling the dice.<br />
                - Each player can roll the dice once every 12 hours and must move their frog during this time.<br />
                - If a player lands on a position that is the end of a ladder, they will be moved up to the higher position. If they land on the head of a snake, they will be moved down to the lower position.
            </p>
            <h3 className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>Antidote:</h3>
            <p className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
                - Players can purchase an antidote for a fee of 0.002 BNB. Each player can have a maximum of 3 antidotes.<br />
                - If a player encounters a snake and has an antidote, they can use it to avoid the negative effects of the snake encounter.<br />
                - If a player is bitten by a snake three times and does not have an antidote, their frog will die, and they will be eliminated from the game.
            </p>
            <h3 className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>Winning:</h3>
            <p className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
                - The player to reach position 100 wins the game.<br />
                - Winners are ranked based on the number of dice rolls they made during the game:<br />
                - If a player wins with 9 rolls or fewer, they will be placed in Group 1 and receive a special prize.<br />
                - The more dice rolls a player has, the higher the group ( 2 && 20 ) they will be placed in, resulting in a lower prize.<br />
                - If a player does not win within a maximum of 29 rolls, their frog will die, and they will be eliminated from the game.
            </p>
            <h3 className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>Inactive States:</h3>
            <p className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
                - If a player does not roll the dice or move their frog for 12 hours, their frog will die, and they will be eliminated from the game.
            </p>
            <h3 className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>Prize Distribution:</h3>
            <p className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
                - Prizes are distributed among winners based on predetermined percentages. These percentages are divided among different groups of winners based on their number of dice rolls.
            </p>
            <h3 className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>Contract Management:</h3>
            <p className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
                - Only the contract owner can pause or resume the contract and withdraw the funds held in the contract.
            </p>
            <h3 className="en" style={{ textAlign: 'left', color: 'red', fontFamily: 'Changa-Medium' }}>Important Notes</h3>
            <p className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
                - Player Activity: To participate in the game and purchase antidotes, players must remain active.<br />
                - Fair Prize Distribution: Prizes are distributed fairly among the winners.<br />
                - Gameplay: Players must participate individually and rely on their luck in the game.<br />
                - Random Nature: This is a game of chance. Factors like player numbers and timing can affect outcomes.<br />
                - Age Restriction: Players under 18 should not participate.<br />
                - Wallet Responsibility: You are solely responsible for your wallet security. We do not have access to your wallet or store personal information.
            </p>
            <h3 className="en" style={{ textAlign: 'left', color: 'red', fontFamily: 'Changa-Medium' }}>Conclusion</h3>
            <p className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
                The Snakes and Ladders game offers an entertaining and competitive experience that allows players to compete in a secure and transparent blockchain environment with their strategy and luck. By following the rules and seizing opportunities, you can become a winner and enjoy the game’s rewards. If you have any questions, please contact our support team.
            </p>
            <h3 className="en" style={{ textAlign: 'left', color: 'red', fontFamily: 'Changa-Medium' }}>Contract Transparency</h3>
            <p className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
                The smart contract is open-source and available for review to ensure transparency at this address (https://bscscan.com/address/#code).
            </p>
            <h3 className="en" style={{ textAlign: 'left', color: 'red', fontFamily: 'Changa-Medium' }}>Transaction Fees</h3>
            <p className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
                Each transaction incurs a small fee, determined by the blockchain network.
            </p>
            <h3 className="en" style={{ textAlign: 'left', color: 'red', fontFamily: 'Changa-Medium' }}>Disclaimer</h3>
            <p className="en" style={{ textAlign: 'left', color: 'green', fontFamily: 'Changa-Medium' }}>
                This is a recreational project with no financial guarantees. Players are responsible for their transactions. Unclaimed prizes return to the group pool for redistribution.
            </p>
        </>
    );

    const persianContent = (
        <>
            <h2 className="fa" style={{ textAlign: 'right', color: 'red', fontFamily: 'Rubik-Light', direction: 'rtl' }}>راهنمای بازی Snakes and Ladders</h2>
            <p className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>
                بازی Snakes and Ladders یک بازی هیجان‌انگیز و رقابتی است که به صورت آنلاین و با استفاده از قراردادهای هوشمند بر بستر بلاک‌چین اجرا می‌شود. در این بازی، بازیکنان با پرتاب تاس و حرکت در صفحه بازی، سعی می‌کنند به خط پایان برسند. این بازی کاملاً شانسی است و در ادامه قوانین و نحوه بازی به تفصیل توضیح داده شده است.
				بازی برای شبکه تستی bnbtestnet تنظیم شده. شما باید از آدرس ( https://www.bnbchain.org/en/testnet-faucet ) مقداری TBNB ( faucet ) تهیه کنید.
تمام وجوه ارسالی شما به بازی، در کنترل کامل قرارداد هوشمند بلاکچین است. هیچکس به انها دسترسی ندارد. تمام محاسبات و پرداخت  ها توسط قرارداد هوشمند انجام میشود.
به 5000 همراهی کننده اول، توکنهای مخصوص بازی در آینده به عنوان جایزه پرداخت خواهد شد.
            </p>
            <h3 className="fa" style={{ textAlign: 'right', color: 'red', fontFamily: 'Rubik-Light', direction: 'rtl' }}>قوانین بازی</h3>
            <h3 className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>پیوستن به بازی:</h3>
            <p className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>
                - برای پیوستن به بازی، هر بازیکن باید مبلغ 0.004 (BNB) به عنوان هزینه ورودی پرداخت کند.<br />
                - حداکثر تعداد بازیکنان در هر بازی 1000 نفر است.<br />
                - اگر تعداد بازیکنان فعال به حداکثر برسد، بازیکنان غیرفعال حذف خواهند شد.<br />
                - برای پیوستن به بازی باید یک کیف پول رمزارز (مانند متاماسک، تراست ولت و غیره) نصب کنید.<br />
                - برای پیوستن به بازی در دستگاه‌های اندروید و iOS، می‌توانید در مرورگر داخلی کیف پول خود به www.lottoariya.xyz بروید و در بازی شرکت کنید.<br />
                - شما باید حدود ۰.۰۰۶ BNB در کیف پول خود داشته باشید تا بتوانید در بازی شرکت کنید و هزینه‌های تراکنش را پوشش دهید.
            </p>
            <h3 className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>حرکت در بازی:</h3>
            <p className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>
                - ساخت عدد تصادفی تاس توسط دو سیستم مجزا ( در برنامه و قرارداد هوشمند ) اجرا شده و تا حد ممکن از تصادفی بودن آن اطمینان حاصل شده است. هر بازیکن با پرتاب تاس (یک عدد تصادفی بین 1 تا 6) حرکت می‌کند.<br />
                - بازیکنان به صورت فردی بازی می‌کنند و هیچ نوبت تاس انداختن وجود ندارد.<br />
                - هر بازیکن هر 12 ساعت یک بار می‌تواند تاس بیندازد و باید در این مدت قورباغه خود را حرکت دهد.<br />
                - اگر بازیکن به خانه‌ای برسد که انتهای نردبان است، به خانه بالاتر منتقل می‌شود. اگر به سر مار برسد، به خانه پایینی منتقل می‌شود.
            </p>
            <h3 className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>پادزهر:</h3>
            <p className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>
                - بازیکنان می‌توانند پادزهر بخرند که هزینه آن 0.002 (BNB) است. هر بازیکن می‌تواند حداکثر 3 پادزهر داشته باشد.<br />
                - اگر بازیکنی با مار برخورد کند و پادزهر داشته باشد، می‌تواند از آن استفاده کند تا از اثر منفی برخورد با مار جلوگیری کند.<br />
                - اگر یک بازیکن سه بار توسط مار نیش زده شود و پادزهر نداشته باشد، قورباغه او خواهد مرد و از بازی حذف می‌شود.
            </p>
            <h3 className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>برنده شدن:</h3>
            <p className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>
                - بازیکنی که به خانه 100 برسد، برنده بازی می‌شود.<br />
                - برندگان بر اساس تعداد تاس‌هایی که در طول بازی انداخته‌اند، رتبه‌بندی می‌شوند:<br />
                - اگر بازیکن با 9 تاس یا کمتر برنده شود، در گروه یک قرار می‌گیرد و شامل جایزه ویژه خواهد شد.<br />
                - هرچه تعداد تاس‌های بازیکن بیشتر باشد، به گروه‌های بالاتر (2 تا 20 ) می‌رود و جایزه او کمتر خواهد شد.<br />
                - اگر بازیکن حداکثر با 29 تاس برنده نشود، قورباغه او خواهد مرد و از بازی حذف می‌شود.
            </p>
            <h3 className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>حالت‌های غیرفعال:</h3>
            <p className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>
                - اگر بازیکنی به مدت 12 ساعت تاس نیندازد و قورباغه خود را حرکت ندهد، قورباغه او خواهد مرد و از بازی حذف می‌شود.
            </p>
            <h3 className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>توزیع جوایز:</h3>
            <p className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>
                - جوایز به برندگان بر اساس درصدهای تعیین شده توزیع می‌شود. درصدها به گروه‌های مختلف برندگان بر اساس تعداد پرتاب‌های تاس آن‌ها تقسیم می‌شود.
            </p>
            <h3 className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>مدیریت قرارداد:</h3>
            <p className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>
                - تنها مالک قرارداد می‌تواند وضعیت قرارداد را متوقف یا از سر بگیرد و وجوه موجود در قرارداد را برداشت کند.
            </p>
            <h3 className="fa" style={{ textAlign: 'right', color: 'red', fontFamily: 'Rubik-Light', direction: 'rtl' }}>نکات مهم</h3>
            <p className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>
                - فعالیت بازیکنان: برای شرکت در بازی و خرید پادزهر، بازیکنان باید فعال باشند.<br />
                - توزیع عادلانه جوایز: جوایز به طور عادلانه بین برندگان تقسیم می‌شود.<br />
                - روند بازی: بازیکنان باید به صورت فردی و با توجه به شانس خود در بازی شرکت می کنند.<br />
                - طبیعت تصادفی: این یک بازی شانس است. عواملی مانند تعداد بازیکنان و زمان می‌توانند بر نتایج تأثیر بگذارند.<br />
                - محدودیت سنی: بازیکنان زیر ۱۸ سال نباید شرکت کنند.<br />
                - مسئولیت کیف پول: شما به تنهایی مسئول امنیت کیف پول خود هستید. ما به کیف پول شما دسترسی نداریم و اطلاعات شخصی را ذخیره نمی‌کنیم.
            </p>
            <h3 className="fa" style={{ textAlign: 'right', color: 'red', fontFamily: 'Rubik-Light', direction: 'rtl' }}>نتیجه‌گیری</h3>
            <p className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>
                بازی Snakes and Ladders یک تجربه سرگرم‌کننده و رقابتی است که به بازیکنان این امکان را می‌دهد که با استراتژی و شانس خود در یک محیط امن و شفاف بلاک‌چین رقابت کنند. با رعایت قوانین و استفاده از فرصت‌ها، می‌توانید به یک برنده تبدیل شوید و از جوایز بازی بهره‌مند شوید. اگر سوالی دارید، لطفاً با تیم پشتیبانی ما تماس بگیرید.
            </p>
            <h3 className="fa" style={{ textAlign: 'right', color: 'red', fontFamily: 'Rubik-Light', direction: 'rtl' }}>شفافیت قرارداد</h3>
            <p className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>
                قرارداد هوشمند منبع باز است و برای بررسی در دسترس است تا شفافیت را در این آدرس (https://bscscan.com/address/code) تضمین کند.
            </p>
            <h3 className="fa" style={{ textAlign: 'right', color: 'red', fontFamily: 'Rubik-Light', direction: 'rtl' }}>هزینه‌های تراکنش</h3>
            <p className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>
                هر تراکنش هزینه کمی دارد که توسط شبکه بلاکچین تعیین می‌شود.
            </p>
            <h3 className="fa" style={{ textAlign: 'right', color: 'red', fontFamily: 'Rubik-Light', direction: 'rtl' }}>سلب مسئولیت</h3>
            <p className="fa" style={{ textAlign: 'right', color: 'green', fontFamily: 'Rubik-Light', direction: 'rtl' }}>
                این یک پروژه تفریحی است و هیچ تضمین مالی ندارد. بازیکنان مسئول تراکنش‌های خود هستند. جوایز بدون استفاده به استخر گروهی برای توزیع مجدد بازمی‌گردند.
            </p>
        </>
    );

    return (
        <div className="how-to-play-modal" ref={ref}>
            <div className="modal-header">
                <h2 className="modal-title">How to Play</h2>
                <div className="modal-header-buttons">
                    <button
                        className={`modal-language-button ${language === 'en' ? 'active' : ''}`}
                        onClick={() => setLanguage('en')}
                    >
                        English
                    </button>
                    <button
                        className={`modal-language-button ${language === 'fa' ? 'active' : ''}`}
                        onClick={() => setLanguage('fa')}
                    >
                        فارسی
                    </button>
                    <button className="modal-close-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
            <div className="modal-content">
                {language === 'en' ? englishContent : persianContent}
            </div>
        </div>
    );
});

export default HowToPlay;