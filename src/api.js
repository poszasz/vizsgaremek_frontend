const BASE = 'http://localhost:3000'

// ========== REGISZTRÁCIÓ ==========
export async function registration(email, username, password) {  
    try {
        console.log("Sending request to:", `${BASE}/registration`)
        console.log("Data:", {email, username, password})
        
        const res = await fetch(`${BASE}/registration`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({email, username, password})
        })
        
        console.log("Response status:", res.status)
        const data = await res.json()
        console.log("Response data:", data)
        
        if(!res.ok) return {result: false, message: data.message}   
        else return {result: true, message: data.message} 
    } catch (error) {
        console.error("Fetch error:", error)
        return {result: false, message: "Network error: " + error.message}
    }
}

// ========== BELÉPÉS ==========
export async function login(emailOrUsername, password) {
    try {
        console.log("Sending login data:", { emailOrUsername, password })
        
        const res = await fetch(`${BASE}/login`, {  
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({ 
                usernameOrEmail: emailOrUsername,
                password: password 
            })
        })
        
        console.log("Login response status:", res.status)
        const data = await res.json()
        console.log("Login response data:", data)
        
        if(!res.ok) return {result: false, message: data.message}   
        else {
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user))
                console.log("User stored:", data.user)
            }
            
            // Fake token, mert a backend sütiben tárolja
            localStorage.setItem('token', 'logged-in')
            
            return {result: true, message: data.message, user: data.user} 
        }
    } catch (error) {
        console.error("Fetch error:", error)
        return {result: false, message: "Network error: " + error.message}
    }
}

// ========== SAJÁT KÁRTYÁK LEKÉRÉSE (már van, de biztos) ==========
export async function getMyCards() {
    try {
        const res = await fetch(`${BASE}/my-cards`, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json()
        if(!res.ok) return {result: false, message: data.message, cards: []}
        else return {result: true, cards: data.cards || []}
    } catch (error) {
        console.error("Fetch error:", error)
        return {result: false, message: "Network error: " + error.message, cards: []}
    }
}

// ========== PACKOK LEKÉRÉSE ==========
export async function getMyPacks() {
    try {
        const res = await fetch(`${BASE}/my-packs`, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json()
        if(!res.ok) return {result: false, message: data.message, packs: 0}
        else return {result: true, packs: data.packs || 0}
    } catch (error) {
        console.error("Fetch error:", error)
        return {result: false, message: "Network error: " + error.message, packs: 0}
    }
}

// ========== PACK NYITÁS ==========
export async function openPack() {
    try {
        const res = await fetch(`${BASE}/open-pack`, {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json()
        if(!res.ok) return {result: false, message: data.message}
        else return {result: true, card: data.card}
    } catch (error) {
        console.error("Fetch error:", error)
        return {result: false, message: "Network error: " + error.message}
    }
}

// ========== PIACI AJÁNLATOK LEKÉRÉSE ==========
export async function getMarketOffers() {
    try {
        const res = await fetch(`${BASE}/market-offers`, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json()
        if(!res.ok) return {result: false, message: data.message, offers: []}
        else return {result: true, offers: data.offers || []}
    } catch (error) {
        console.error("Fetch error:", error)
        return {result: false, message: "Network error: " + error.message, offers: []}
    }
}

// ========== AJÁNLAT ELFOGADÁSA ==========
export async function acceptOffer(offerId) {
    try {
        const res = await fetch(`${BASE}/accept-offer/${offerId}`, {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json()
        if(!res.ok) return {result: false, message: data.message}
        else return {result: true, message: data.message}
    } catch (error) {
        console.error("Fetch error:", error)
        return {result: false, message: "Network error: " + error.message}
    }
}

// ========== MARKET LISTINGOK LEKÉRÉSE ==========
export async function getMarketListings() {
    try {
        const res = await fetch(`${BASE}/market-listings`, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json()
        if(!res.ok) return {result: false, message: data.message, listings: []}
        else return {result: true, listings: data.listings || []}
    } catch (error) {
        console.error("Fetch error:", error)
        return {result: false, message: "Network error: " + error.message, listings: []}
    }
}

// ========== ÚJ LISTING LÉTREHOZÁSA ==========
export async function createListing(userCardId) {
    try {
        const res = await fetch(`${BASE}/create-listing`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({ userCardId })
        })
        const data = await res.json()
        if(!res.ok) return {result: false, message: data.message}
        else return {result: true, message: data.message, listingId: data.listingId}
    } catch (error) {
        console.error("Fetch error:", error)
        return {result: false, message: "Network error: " + error.message}
    }
}

// ========== AJÁNLAT TÉTELE ==========
export async function makeOffer(listingId, offeredUserCardId) {
    try {
        const res = await fetch(`${BASE}/make-offer`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({ listingId, offeredUserCardId })
        })
        const data = await res.json()
        if(!res.ok) return {result: false, message: data.message}
        else return {result: true, message: data.message, offerId: data.offerId}
    } catch (error) {
        console.error("Fetch error:", error)
        return {result: false, message: "Network error: " + error.message}
    }
}

// ========== SAJÁT LISTINGEK LEKÉRÉSE ==========
export async function getMyListings() {
    try {
        const res = await fetch(`${BASE}/my-listings`, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json()
        if(!res.ok) return {result: false, message: data.message, listings: []}
        else return {result: true, listings: data.listings || []}
    } catch (error) {
        console.error("Fetch error:", error)
        return {result: false, message: "Network error: " + error.message, listings: []}
    }
}

// ========== SAJÁT FÜGGŐBEN LÉVŐ OFFEREK LEKÉRÉSE ==========
export async function getMyPendingOffers() {
    try {
        const res = await fetch(`${BASE}/my-pending-offers`, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json()
        if(!res.ok) return {result: false, message: data.message, offers: []}
        else return {result: true, offers: data.offers || []}
    } catch (error) {
        console.error("Fetch error:", error)
        return {result: false, message: "Network error: " + error.message, offers: []}
    }
}

// ========== OFFER TÖRLÉSE ==========
export async function deleteOffer(offerId) {
    try {
        const res = await fetch(`${BASE}/offer/${offerId}`, {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json()
        if(!res.ok) return {result: false, message: data.message}
        else return {result: true, message: data.message}
    } catch (error) {
        console.error("Fetch error:", error)
        return {result: false, message: "Network error: " + error.message}
    }
}

// ========== LISTING TÖRLÉSE ==========
export async function deleteListing(listingId) {
    try {
        const res = await fetch(`${BASE}/listing/${listingId}`, {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json()
        if(!res.ok) return {result: false, message: data.message}
        else return {result: true, message: data.message}
    } catch (error) {
        console.error("Fetch error:", error)
        return {result: false, message: "Network error: " + error.message}
    }
}