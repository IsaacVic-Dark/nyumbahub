<?php

namespace App\Enums;

enum EvidenceType: string
{
    case PhoneOtp = 'phone_otp';
    case Photo = 'photo';
    case Video = 'video';
    case Receipt = 'receipt';
    case Agreement = 'agreement';
    case NationalId = 'national_id';
}
