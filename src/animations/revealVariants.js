import { motionConfig } from './motionConfig';

export const revealVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: motionConfig.revealTransition
    }
};

export const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: motionConfig.heroTransition
    }
};
