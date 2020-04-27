import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    let subscribeVariable = { userTo: props.userTo, userFrom: props.userFrom }


    const onSubscribe = () => {

        if (Subscribed) {
            // 구독 중일 때 -> 구독 해제 시킨다

            axios.post('/api/subscribe/unSubscribe', subscribeVariable)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('Failed to unSubscribe')
                    } 
                })
                    

        } else { 
            // 구독 중이 아닐 때 -> 구독 시킨다

            axios.post('/api/subscribe/subscribe', subscribeVariable)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('Failed to unSubscribe')
                    } 
                })
        }
    }
    

    useEffect(() => {
        
        

        axios.post('/api/subscribe/subscribeNumber', subscribeVariable)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                    // console.log()
                } else {
                    alert('Failed to get subscribe number')
                }
            })
        
        axios.post('/api/subscribe/subscribed', subscribeVariable)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subscribed)
                } else {
                    alert('Failed to get my subscribed info')
                }
            })

        
    }, [])



    return (
        <div>
            <button
                onClick={onSubscribe}
                style={{
                backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                borderRadius: '4px', color: 'white',
                padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
            >
                {SubscribeNumber} {Subscribed ? "Subscribed" : "Subscribe"}
            </button>
        </div>
    )
}

export default Subscribe
