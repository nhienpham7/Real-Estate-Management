import React, { useState } from 'react'
import kitchenImage from '../context/kitchen.jpg';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
    })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Contact form submitted:", formData)
        setSubmitted(true)
        setTimeout(() => {
            setFormData({ firstName: "", lastName: "", email: "", message: "" })
            setSubmitted(false)
        }, 3000)
    }

    return (
        <div
            style={{
                display: "flex",
                gap: "100px",
                padding: "inherit",
                alignItems: "flex-start",
                backgroundColor: "#efefec",
                minHeight: "100vh",
                boxSizing: "border-box"
            }}
        >
            {/* LEFT COLUMN */}
            <div style={{ flex: "1 1 640px", maxWidth: "760px" }}>
                <h1
                    style={{
                        fontSize: "84px",
                        fontWeight: 400,
                        margin: 0,
                        marginBottom: "18px",
                        fontFamily: "Georgia, 'Times New Roman', serif",
                        color: "#0b0b0b",
                        lineHeight: 1
                    }}
                >
                    Contact Us
                </h1>

                <p style={{ fontSize: "18px", lineHeight: "1.7", marginTop: "18px", color: "#222", maxWidth: "520px" }}>
                    We'd love to hear from you! Whether you have questions about our properties, need assistance with your account, 
                    or just want to say hello, our team is here to help. 
                    Fill out the form below or reach us through the provided contact details.
                </p>

                <p style={{ marginTop: "24px", marginBottom: "48px", fontSize: "16px", color: "#222" }}>
                    email@example.com <br />
                    (555) 555-5555
                </p>

                {/* Spacer so the form sits lower like the design */}
                <div style={{ height: "6px" }} />

                {/* FORM */}
                <form style={{ width: "100%" }} onSubmit={handleSubmit}>
                    <label style={{ fontSize: "14px", color: "#111", display: "block", marginBottom: "8px" }}>
                        Name <span style={{ color: "#777", fontSize: "13px" }}>(required)</span>
                    </label>

                    <div style={{ display: "flex", gap: "20px", marginBottom: "22px", alignItems: "center" }}>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            style={{
                                flex: 1,
                                padding: "14px 22px",
                                borderRadius: "9999px",
                                border: "1px solid #111",
                                background: "#efefef",
                                fontSize: "15px"
                            }}
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            style={{
                                flex: 1,
                                padding: "14px 22px",
                                borderRadius: "9999px",
                                border: "1px solid #111",
                                background: "#efefef",
                                fontSize: "15px"
                            }}
                        />
                    </div>

                    <label style={{ fontSize: "14px", color: "#111", display: "block", marginBottom: "8px" }}>
                        Email <span style={{ color: "#777", fontSize: "13px" }}>(required)</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "14px 22px",
                            borderRadius: "9999px",
                            border: "1px solid #111",
                            background: "#efefef",
                            fontSize: "15px",
                            marginBottom: "22px"
                        }}
                    />

                    <label style={{ fontSize: "14px", color: "#111", display: "block", marginBottom: "8px" }}>
                        Message <span style={{ color: "#777", fontSize: "13px" }}>(required)</span>
                    </label>
                    <textarea
                        name="message"
                        placeholder=""
                        value={formData.message}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "20px",
                            borderRadius: "18px",
                            border: "1px solid #111",
                            background: "#efefef",
                            fontSize: "15px",
                            height: "150px",
                            marginBottom: "26px",
                            resize: "vertical"
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            padding: "12px 34px",
                            borderRadius: "9999px",
                            border: "none",
                            backgroundColor: "#223a55",
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: 600,
                            cursor: "pointer",
                            letterSpacing: "0.6px"
                        }}
                    >
                        {submitted ? "SENT" : "SEND"}
                    </button>
                </form>
            </div>

            {/* RIGHT COLUMN - IMAGE */}
            <div
                style={{
                    flex: "0 0 360px",
                    height: "780px",
                    backgroundImage: `url(${kitchenImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "6px"
                }}
            />
        </div>
    )
}
