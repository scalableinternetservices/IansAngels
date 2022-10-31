import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function Home() {
  return (
    <div>
      <div className="m-5">
        <h1 className="text-center">Home Page</h1>
      </div>
      <div className="m-5">
        <Container>
          <Row>
            <Col className="text-center">
              <Link href="/client">
                <Button variant="primary">Client Page</Button>
              </Link>
            </Col>
            <Col className="text-center">
              <Link href="/pos">
                <Button variant="primary">POS Page</Button>
              </Link>
            </Col>
            <Col className="text-center">
              <Link href="/kitchen">
                <Button variant="primary">Kitchen Page</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}
