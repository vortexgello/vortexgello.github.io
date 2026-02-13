import numpy as np

class SingleBoomCalculator:
    def __init__(self, radius_mm, angle_deg, ply_thickness_mm, num_plies):
        # 1. Geometry Inputs
        self.R = radius_mm / 1000.0  # meters
        self.beta = np.radians(angle_deg)
        self.h = (ply_thickness_mm * num_plies) / 1000.0
        
        # 2. Material Model (Default: Uncalibrated Standard Carbon)
        # We start with theoretical estimates, then overwrite if you calibrate.
        self.E_axial = 130e9  # Pa
        I_wall = (self.h**3) / 12.0
        
        # Theoretical D-Matrix for [+/-45] (High Coupling)
        self.D11 = 0.5 * self.E_axial * I_wall 
        self.D22 = 0.5 * self.E_axial * I_wall
        self.D12 = 0.35 * self.E_axial * I_wall # High D12 from 45 deg plies
        
        self.calibrated = False

    def calibrate(self, test_length_mm, max_mass_strong_g, max_mass_weak_g):
        """
        Updates D-Matrix based on your actual tip-load tests.
        Ref: Murphey et al. 2015 (Source 516) - Corrected Signs.
        """
        g = 9.81
        L = test_length_mm / 1000.0
        
        # Calculate Moments from your test weights
        M_strong = (max_mass_strong_g / 1000.0) * g * L
        M_weak   = (max_mass_weak_g / 1000.0) * g * L
        
        # Reverse Solve Physics
        # M_strong = beta * (D_bend + D12)
        # M_weak   = beta * (D_bend - D12)
        
        D_bend = (M_strong + M_weak) / (2 * self.beta)
        D_couple = (M_strong - M_weak) / (2 * self.beta)
        
        self.D11 = D_bend / 2.0 
        self.D22 = D_bend / 2.0
        self.D12 = D_couple
        self.calibrated = True
        print(f"Calibration Successful: D11={self.D11*1000:.3f} mNm, D12={self.D12*1000:.3f} mNm")

    def calculate_tip_load(self, target_length_mm, safety_factor=1.5):
        """
        The Master Function: Calculates Max Tip Load and downstream effects.
        """
        L = target_length_mm / 1000.0
        g = 9.81
        
        # A. Calculate Critical Moments (The Limit)
        M_snap_strong = self.beta * (self.D11 + self.D22 + self.D12) # +D12 (Opposite)
        M_snap_weak   = self.beta * (self.D11 + self.D22 - self.D12) # -D12 (Equal)
        
        # B. Calculate Max Safe Tip Load (Force & Mass)
        # Using Strong Axis (Cup Down) for Design
        F_max_N = M_snap_strong / (L * safety_factor)
        Mass_max_g = (F_max_N / g) * 1000.0
        
        # C. Downstream Calculation: Deflection
        # EI Effective approx D11 * Geometry Factor (0.14*R^2*beta/t^2...) 
        # Simplified: EI ~ D11 * (R_deployed/t_wall)^2
        # For open section, geometric stiffness is complex, approximating:
        EI_eff = self.D11 * (self.R / self.h)**2 * 0.15 # Empirical factor
        
        deflection_mm = 0
        if EI_eff > 0:
            deflection_mm = ((F_max_N * L**3) / (3 * EI_eff)) * 1000.0
            
        # D. Downstream Calculation: Deployment Torque
        # Energy available to push boom out (Source 406)
        # Torque approx equal to Snap Moment
        deploy_torque_mNm = M_snap_strong * 1000.0
        
        return {
            "Boom Length": f"{target_length_mm} mm",
            "--- PRIMARY RESULT: TIP LOAD ---": "----------------",
            "Max Safe Mass (1G)": f"{Mass_max_g:.2f} g",
            "Max Safe Force":     f"{F_max_N:.3f} N",
            "Limit Mode": "Snap-Through Buckling (Opposite Sense)",
            "--- DERIVED CALCULATIONS ---": "----------------",
            "Est. Deflection @ Max Load": f"{deflection_mm:.1f} mm",
            "Deployment Torque": f"{deploy_torque_mNm:.1f} mNm",
            "Orientation Required": "Cup Down (Convex Up)",
            "Safety Factor Used": safety_factor
        }

# --- USAGE ---

# 1. Define your boom
boom = SingleBoomCalculator(radius_mm=11, angle_deg=180, ply_thickness_mm=0.17, num_plies=2)

# 2. Calibrate with your real data (60g strong, 35g weak @ 50cm)
# This aligns the math with your specific resin/fiber/cure.
boom.calibrate(test_length_mm=500, max_mass_strong_g=60, max_mass_weak_g=35)

# 3. ASK THE QUESTION: "What can a 70cm boom hold?"
# All other calcs (deflection, torque) happen automatically based on this.
result = boom.calculate_tip_load(target_length_mm=700)

for k, v in result.items():
    print(f"{k}: {v}")