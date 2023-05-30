- add modal:
// import modal
import { Modal } from 'react-bootstrap';
// function to close modal
const [show,setShow] = useState(false);
const handleClose = useCallback(() => setShow(false),[])
// render modal
<div className='mb-2'>
    <button className='btn btn-primary' onClick={() => setShow(true)}>Thêm sản phẩm</button>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>THÊM SẢN PHẨM MỚI</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
            <button className='btn btn-primary' onClick={handleClose}>Thêm sản phẩm</button>
            <button className='btn btn-secondary' onClick={handleClose}>Đóng</button>
        </Modal.Footer>
    </Modal>
</div>