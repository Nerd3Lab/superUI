// src/components/Modal.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react/dist/iconify.js';
import { closeModal } from '../../states/modal/reducer';

interface ModalProps {
  modalId: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ modalId, children }) => {
  const dispatch = useDispatch();
  const isVisible = useSelector((state: any) => state.modal[modalId]);
  const [shouldRender, setShouldRender] = useState(false);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setTimeout(() => setOpening(true), 150);
    } else {
      setOpening(false);
      setTimeout(() => {
        setShouldRender(false);
      }, 150); // Matches the CSS transition duration
    }
  }, [isVisible]);

  const handleClose = () => {
    dispatch(closeModal(modalId));
  };

  return shouldRender ? (
    <div
      className={`fixed z-[1000] w-screen h-screen top-0 right-0 flex justify-center items-center`}
    >
      <div
        onClick={handleClose}
        className={`opacity-30 w-full h-full absolute top-0 left-0 ${
          isVisible
            ? opening
              ? 'bg-black/70'
              : ' bg-black/70'
            : 'opacity-0 '
        }`}
      ></div>
      <div
        className={`w-auto bg-white p-6 rounded-md relative transition-all ${
          opening ? 'translate-y-0 opacity-100' : 'translate-y-[200%] opacity-0'
        }`}
      >
        <div
          onClick={handleClose}
          className="absolute right-2 top-2 z-10 text-gray-500 cursor-pointer"
        >
          <Icon icon={'ion:close'} className="text-2xl" />
        </div>
        {children}
      </div>
    </div>
  ) : null;
};

export default Modal;
