from app.models.user import ClearanceLevel

# Hierarchy mapping
LEVEL_HIERARCHY = {
    ClearanceLevel.UNCLASSIFIED: 0,
    ClearanceLevel.CONFIDENTIAL: 1,
    ClearanceLevel.SECRET: 2,
    ClearanceLevel.TOP_SECRET: 3
}

def can_read(user_level: str, resource_level: str) -> bool:
    """
    Bell-LaPadula Simple Security Property: No Read Up.
    Subject can read Object only if Subject.Level >= Object.Level
    """
    u_val = LEVEL_HIERARCHY.get(user_level, 0)
    r_val = LEVEL_HIERARCHY.get(resource_level, 0)
    return u_val >= r_val

def can_write(user_level: str, resource_level: str) -> bool:
    """
    Bell-LaPadula *-Property (Star Property): No Write Down.
    Subject can write to Object only if Subject.Level <= Object.Level
    """
    u_val = LEVEL_HIERARCHY.get(user_level, 0)
    r_val = LEVEL_HIERARCHY.get(resource_level, 0)
    return u_val <= r_val
