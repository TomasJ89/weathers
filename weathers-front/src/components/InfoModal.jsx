import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function InfoModal({ isOpen, onClose }) {
    const nav = useNavigate();
    const modalRef = useRef(null);

    useEffect(() => {
        // Show or close the modal based on the `isOpen` state
        if (isOpen && modalRef.current) {
            modalRef.current.showModal();
        } else if (!isOpen && modalRef.current) {
            modalRef.current.close();
        }
    }, [isOpen]);

    return (
        <dialog ref={modalRef} id="my_modal_3" className="modal">
            <div className="modal-box">
                {/*Close Modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>
                    ✕
                </button>
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">
                    If you want to see more information about this place's weather, you need to log in.
                </p>
                <button className="btn" onClick={() => nav("/login")}>Log in</button>
            </div>
            {/* Click outside the modal to close it */}
            <div className="modal-backdrop" onClick={onClose}></div>
        </dialog>
    );
}

export default InfoModal;
