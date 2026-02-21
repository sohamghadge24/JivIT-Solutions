import { motion } from 'framer-motion';
import { motionConfig } from './motionConfig';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 10
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: motionConfig.transition
    },
    exit: {
        opacity: 0,
        y: 10,
        transition: motionConfig.transition
    }
};

const PageTransition = ({ children }) => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
