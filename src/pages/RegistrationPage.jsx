import { useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import TextBox from "../components/TextBox"
import Button from "../components/Button"
import { registration } from "../api"
import { useNavigate } from "react-router-dom"
import logo from '../assets/carcardsLogo.png'

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
        backgroundColor: '#27ae60',
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
            <nav className="navbar navbar-dark bg-secondary">
                <div className="container-fluid d-flex align-items-center position-relative">
                    <button 
                        onClick={goToHome}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                        <img src={logo} alt="Car Cards Logo" style={{ height: '40px', width: 'auto' }} />
                    </button>

                    <span className="navbar-text fs-3 text-white position-absolute start-50 translate-middle-x">
                        Sign Up
                    </span>

                    <div className="ms-auto">
                        {isLoggedIn && (
                            <button
                                className="btn btn-outline-light"
                                onClick={handleLogout}
                                style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                            >
                                ↪
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <div className="flex-grow-1 d-flex justify-content-center align-items-center p-4">
                <div className="text-center" style={{ maxWidth: '1000px', width: '100%' }}>
                    
                    <h2 className="text-white mb-4" style={{ fontSize: '2rem', fontWeight: '300' }}>
                        Create Account
                    </h2>
                    
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
                                    e.target.style.backgroundColor = '#219a52'
                                    e.target.style.transform = 'scale(1.02)'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.target.style.backgroundColor = '#27ae60'
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
                                color: '#6fcf97',
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