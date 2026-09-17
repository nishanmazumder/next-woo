"use client";

import { useState } from "react";

interface RecommendationFormProps {
    blogId: string;
    blogSlug: string;
}

export default function RecommendationForm({blogId, blogSlug} : RecommendationFormProps) {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSubmitted(true);
    };

    return (
        <div id="recommendation">
            {submitted ? (
                <p>Thank you for your recommendation!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        required
                    />

                    <button type="submit">
                        Submit Recommendation
                    </button>
                </form>
            )}
        </div>
    );
}
