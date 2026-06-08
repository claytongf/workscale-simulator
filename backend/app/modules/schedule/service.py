from app.modules.schedule.schemas import ScheduleInput


def check_day_is_workday(day_index: int, schedule: ScheduleInput) -> bool:
    """
    Returns True if day_index (1-indexed) is a workday according to the schedule.
    """
    if schedule.type == "12x36":
        # 12x36 alternates: work day 1, rest day 2, work day 3...
        return day_index % 2 == 1
        
    # Weekly cycles
    cycle_day = (day_index - 1) % 7
    
    if schedule.type == "6x1":
        return cycle_day < 6
    elif schedule.type == "5x2":
        return cycle_day < 5
    elif schedule.type == "4x3":
        return cycle_day < 4
    elif schedule.type == "custom":
        if schedule.workdays_per_week is None:
            raise ValueError("workdays_per_week is required for custom schedules")
        return cycle_day < schedule.workdays_per_week
        
    return False
