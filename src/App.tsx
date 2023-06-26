import './App.scss'
import { Suspense, lazy } from 'react'
import { Col, Container } from 'react-bootstrap'
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('./components/Home'))
const File = lazy(() => import('./components/File'))
const RequestsFile = lazy(() => import('./components/RequestsFile'))
const FileSent = lazy(() => import('./components/FileSent'))

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container>
        <Col xl={{ span: 6, offset: 3 }}>
          <Routes>
            <Route path='/' element={<Suspense> <Home /></Suspense>}></Route>
            <Route path='/files' element={<Suspense><RequestsFile /></Suspense>}></Route>
            <Route path='/files/:id' element={<Suspense><File /></Suspense>}></Route>
            <Route path='/sent' element={<Suspense><FileSent /></Suspense>}></Route>
          </Routes>
        </Col>
      </Container>
    </BrowserRouter>
  )
}

export default App
