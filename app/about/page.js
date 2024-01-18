import Image from "next/image";
import img1 from "@/public/images/img1.jpg";

export default function About() {
    return (
        <main className="m-2 bg-lime-900 h-screen">
            <h1>About</h1>


            <div className="w-[400px]">
                <Image src={img1} alt="Image" quality={100} placeholder="blur" />
            </div>
        </main>
    )
}
