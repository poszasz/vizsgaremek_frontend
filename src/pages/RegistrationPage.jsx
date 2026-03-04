import { useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import TextBox from "../components/TextBox"
import Button from "../components/Button"
import { registration } from "../api"
import { useNavigate } from "react-router-dom"

export default function RegistrationPage() {
    const navigation = useNavigate()

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const buttonStyle = {
        width: '500px',
        padding: '17px 0',
        fontSize: '1.3rem',
        borderRadius: '30px',
        border: 'none',
        backgroundColor: '#3498db',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        opacity: loading ? 0.7 : 1
    }

    const textBoxStyle = {
        input: {
            backgroundColor: '#1a1a1a',
            color: 'white',
            border: '1px solid #444',
            borderRadius: '30px',
            padding: '15px 25px',
            fontSize: '1.1rem',
            width: '100%',
            transition: 'all 0.3s ease'
        },
        placeholder: {
            color: '#aaa'
        }
    }

    const isLoggedIn = localStorage.getItem('token')

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigation('/')
    }

    const goToHome = () => {
        navigation('/')
    }

    return (
        <div className="vh-100 d-flex flex-column">
            {/* Fix méretű navbar */}
            <nav className="navbar" style={{ 
                height: '70px', 
                minHeight: '70px',
                backgroundColor: '#d1d1d1',
            }}>
                <div className="container-fluid d-flex align-items-center justify-content-between px-4" style={{ height: '100%' }}>
                    {/* Bal oldal üres - egyensúly miatt */}
                    <div style={{ width: '50px' }}></div>

                    {/* Középen a Sign Up szöveg */}
                    <span style={{ 
                        fontSize: '2rem', 
                        fontWeight: '500',
                        color: '#000000',
                        lineHeight: '1',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}>
                        Sign Up
                    </span>

                    {/* Jobb oldali vissza ikon */}
                    <button
                        onClick={goToHome}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#000000',
                            fontSize: '2rem',
                            cursor: 'pointer',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            transition: 'background-color 0.3s ease',
                            padding: 0
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent'
                        }}
                    >
                        ←
                    </button>
                </div>
            </nav>

            <div className="flex-grow-1 d-flex justify-content-center align-items-center p-4">
                <div className="text-center" style={{ maxWidth: '1000px', width: '100%' }}>
                    
                    <div className="row g-4">
                        <div className="col-md-6">
                            <TextBox
                                type={"email"}
                                placeholder={"Email address"}
                                value={email}
                                setValue={setEmail}
                                inputStyle={textBoxStyle.input}
                                placeholderStyle={textBoxStyle.placeholder}
                            />
                        </div>
                        <div className="col-md-6">
                            <TextBox
                                type={"text"}
                                placeholder={"Username"}
                                value={username}
                                setValue={setUsername}
                                inputStyle={textBoxStyle.input}
                                placeholderStyle={textBoxStyle.placeholder}
                            />
                        </div>

                        <div className="col-md-6">
                            <TextBox
                                type={"password"}
                                placeholder={"Password"}
                                value={password}
                                setValue={setPassword}
                                inputStyle={textBoxStyle.input}
                                placeholderStyle={textBoxStyle.placeholder}
                            />
                        </div>
                        <div className="col-md-6">
                            <TextBox
                                type={"password"}
                                placeholder={"Confirm password"}
                                value={confirmPassword}
                                setValue={setConfirmPassword}
                                inputStyle={textBoxStyle.input}
                                placeholderStyle={textBoxStyle.placeholder}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-5">
                        <button
                            style={buttonStyle}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.target.style.backgroundColor = '#2980b9'
                                    e.target.style.transform = 'scale(1.02)'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.target.style.backgroundColor = '#3498db'
                                    e.target.style.transform = 'scale(1)'
                                }
                            }}
                            onClick={async () => {
                                if (!email || !username || !password || !confirmPassword) {
                                    return alert("Please fill in all fields!")
                                }
                                if (password !== confirmPassword) {
                                    return alert("Passwords do not match!")
                                }
                                
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                if (!emailRegex.test(email)) {
                                    return alert("Please enter a valid email address!")
                                }

                                setLoading(true)
                                const res = await registration(email, username, password)
                                setLoading(false)

                                if (res.result) {
                                    alert("Registration successful!")
                                    navigation('/login')
                                } else {
                                    alert(res.message || "Registration failed!")
                                }
                            }}
                        >
                            {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <span style={{ color: '#ccc' }}>Already have an account? </span>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#5dade2',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                textDecoration: 'underline',
                                padding: 0
                            }}
                            onClick={() => navigation('/login')}
                        >
                            Login here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}