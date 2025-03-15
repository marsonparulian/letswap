import Image from "next/image";
import styles from "./page.module.css";

export default function AboutPage() {
    return (
        <div className={styles.page}>
            <main className={`${styles.main} `}>
                <Image
                    src="/hero-desktop.webp"
                    width={1100}
                    height={500}
                    className=""
                    alt="Hero cartoon image"
                />

                <Image
                    className={styles.logo}
                    style={{ border: '4px solid red' }}
                    src="/letswap.svg"
                    alt="LetSwap logo"
                    width={160}
                    height={160}
                    priority
                />

                <blockquote>Swap your collectibles with ease !</blockquote>

                <div className={styles.ctas}>
                    <a
                        className={styles.primary}
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            className={styles.logo}
                            src="/right-point.svg"
                            alt="next logomark"
                            width={20}
                            height={20}
                        />
                        Browse Collection Series
                    </a>
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.secondary}
                    >
                        Sign up
                    </a>
                </div>
            </main>
            <footer className={styles.footer}>
                <a
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/file.svg"
                        alt="File icon"
                        width={16}
                        height={16}
                    />
                    Learn
                </a>
                <a
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/window.svg"
                        alt="Window icon"
                        width={16}
                        height={16}
                    />
                    Examples
                </a>
                <a
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/globe.svg"
                        alt="Globe icon"
                        width={16}
                        height={16}
                    />
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    );
}
