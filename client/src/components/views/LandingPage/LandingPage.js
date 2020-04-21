import React, { useEffect, useState } from 'react'
import { Card, Icon, Avatar, Col, Typography, Row } from 'antd';
import Axios from 'axios';
import moment from 'moment';
import { Skeleton } from 'antd';
const { Title } = Typography
const { Meta } = Card;

// try to Shows a loading indicator while the contents of the card is being fetched.
function renderWhat(Loading) {
    if (Loading == true) {
        return renderCards
    } else {
        return <Col lg={6} md={8} xs={24} >
            <Card style={{ width: 300, marginTop: 16 }}>
                <Skeleton loading={true} avatar active>
                    <Meta
                        avatar={ <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> }
                        title="Card title"
                        description="This is the description"
                    />
                </Skeleton>
            </Card>
        </Col>
    }

}

function LandingPage() {

    const [Video, setVideo] = useState([])
    const [Loading, setLoading] = useState(false)

    useEffect(() => {
        Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success) {
                // console.log(response.data)
                setVideo(response.data.videos)
                setLoading(true)
            } else {
                alert('비디오 가져오기를 실패했습니다.')
            }
        })
    }, []) // input이 비어있으면 한 번만, 리엑트 훅 문법


    const renderCards = Video.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <Col lg={6} md={8} xs={24} key={index}>
            <a href={`/video/post/${video._id}`} >
                <div style={{ position: 'relative' }}>
                    <img style={{ width: '100%' }} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
                    <div className=" duration">
                        <span>{minutes} : {seconds} </span>
                    </div>  
                </div>
            </a>
            <br />  
                    
            <Meta
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title={video.title}
                description=""
            />
            <span>{video.writer.name} </span><br />
            <span style={{ marginLeft: '3rem' }}> {video.view} views </span> - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
        </Col>
        
    })


    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > Recommended </Title>
            <br />
            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default LandingPage
