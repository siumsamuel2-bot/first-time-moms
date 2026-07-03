-- Add quiz results and referral tables

-- Risk level enum
CREATE TYPE risk_level AS ENUM ('low', 'moderate', 'high', 'urgent');

-- Quiz results table
CREATE TABLE quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answers TEXT NOT NULL,
    risk_level risk_level NOT NULL,
    summary TEXT NOT NULL,
    recommendations TEXT[],
    next_steps TEXT[],
    email TEXT,
    name TEXT,
    referral_code TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Referral status enum
CREATE TYPE referral_status AS ENUM ('pending', 'completed', 'expired', 'fraud');

-- Referrals table
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_code TEXT NOT NULL,
    referred_email TEXT NOT NULL,
    status referral_status NOT NULL DEFAULT 'pending',
    reward_claimed TEXT DEFAULT 'false',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_quiz_results_email ON quiz_results(email);
CREATE INDEX idx_quiz_results_risk_level ON quiz_results(risk_level);
CREATE INDEX idx_referrals_code ON referrals(referrer_code);
CREATE INDEX idx_referrals_email ON referrals(referred_email);
