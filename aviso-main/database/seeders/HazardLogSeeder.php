<?php

namespace Database\Seeders;

use App\Models\HazardLog;
use Illuminate\Database\Seeder;

/**
 * Seeds the hazard_logs table with 125 mock detections that mirror the
 * data in resources/js/data/mockHazards.ts.
 *
 * When real rider data starts flowing in, this seeder stays as demo / staging
 * data — it won't conflict because haz_codes are unique and the seeder uses
 * updateOrCreate() so it is safe to run multiple times.
 */
class HazardLogSeeder extends Seeder
{
    public function run(): void
    {
        $records = [
            // ── City Proper ────────────────────────────────────────────────
            ['haz_code'=>'HAZ-001','type'=>'Pothole',         'area'=>'City Proper','latitude'=>6.90564,'longitude'=>122.07683,'confidence'=>91.2,'distance'=>4.5, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-002','type'=>'Road Excavation', 'area'=>'City Proper','latitude'=>6.90168,'longitude'=>122.07432,'confidence'=>88.5,'distance'=>12.1,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-003','type'=>'Road Barrier',    'area'=>'City Proper','latitude'=>6.90701,'longitude'=>122.07194,'confidence'=>97.8,'distance'=>18.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-004','type'=>'Pothole',         'area'=>'City Proper','latitude'=>6.90660,'longitude'=>122.07593,'confidence'=>91.0,'distance'=>3.2, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-005','type'=>'Pothole',    'area'=>'City Proper','latitude'=>6.90981,'longitude'=>122.06905,'confidence'=>85.4,'distance'=>8.9, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-006','type'=>'Pothole',   'area'=>'City Proper','latitude'=>6.90728,'longitude'=>122.07397,'confidence'=>96.1,'distance'=>22.0,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-007','type'=>'Pothole',         'area'=>'City Proper','latitude'=>6.90607,'longitude'=>122.06922,'confidence'=>89.9,'distance'=>6.7, 'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-008','type'=>'Road Excavation', 'area'=>'City Proper','latitude'=>6.90403,'longitude'=>122.07903,'confidence'=>92.3,'distance'=>14.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-009','type'=>'Road Barrier',    'area'=>'City Proper','latitude'=>6.90513,'longitude'=>122.07654,'confidence'=>98.4,'distance'=>15.2,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-010','type'=>'Pothole',         'area'=>'City Proper','latitude'=>6.90849,'longitude'=>122.07087,'confidence'=>93.7,'distance'=>4.8, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],
            ['haz_code'=>'HAZ-011','type'=>'Road Excavation', 'area'=>'City Proper','latitude'=>6.90620,'longitude'=>122.06934,'confidence'=>87.5,'distance'=>10.1,'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 15:45:11'],
            ['haz_code'=>'HAZ-012','type'=>'Pothole',    'area'=>'City Proper','latitude'=>6.90733,'longitude'=>122.07377,'confidence'=>92.4,'distance'=>5.5, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 16:15:22'],
            ['haz_code'=>'HAZ-013','type'=>'Pothole',         'area'=>'City Proper','latitude'=>6.90638,'longitude'=>122.06909,'confidence'=>89.2,'distance'=>2.1, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 16:30:00'],
            ['haz_code'=>'HAZ-014','type'=>'Road Barrier',    'area'=>'City Proper','latitude'=>6.90729,'longitude'=>122.07788,'confidence'=>95.8,'distance'=>14.3,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 17:10:45'],
            ['haz_code'=>'HAZ-015','type'=>'Pothole',   'area'=>'City Proper','latitude'=>6.90474,'longitude'=>122.07545,'confidence'=>99.1,'distance'=>16.8,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 17:25:14'],

            // ── Calarian ───────────────────────────────────────────────────
            ['haz_code'=>'HAZ-016','type'=>'Pothole',         'area'=>'Calarian','latitude'=>6.93906,'longitude'=>122.04339,'confidence'=>91.2,'distance'=>4.5, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-017','type'=>'Road Excavation', 'area'=>'Calarian','latitude'=>6.93601,'longitude'=>122.04098,'confidence'=>88.5,'distance'=>12.1,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-018','type'=>'Road Barrier',    'area'=>'Calarian','latitude'=>6.92629,'longitude'=>122.02459,'confidence'=>97.8,'distance'=>18.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-019','type'=>'Pothole',         'area'=>'Calarian','latitude'=>6.93698,'longitude'=>122.03656,'confidence'=>91.0,'distance'=>3.2, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-020','type'=>'Pothole',    'area'=>'Calarian','latitude'=>6.93855,'longitude'=>122.02580,'confidence'=>85.4,'distance'=>8.9, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-021','type'=>'Pothole',   'area'=>'Calarian','latitude'=>6.93904,'longitude'=>122.02472,'confidence'=>96.1,'distance'=>22.0,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-022','type'=>'Pothole',         'area'=>'Calarian','latitude'=>6.92827,'longitude'=>122.02460,'confidence'=>89.9,'distance'=>6.7, 'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-023','type'=>'Road Excavation', 'area'=>'Calarian','latitude'=>6.92516,'longitude'=>122.02781,'confidence'=>92.3,'distance'=>14.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-024','type'=>'Road Barrier',    'area'=>'Calarian','latitude'=>6.94171,'longitude'=>122.03112,'confidence'=>98.4,'distance'=>15.2,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-025','type'=>'Pothole',         'area'=>'Calarian','latitude'=>6.93600,'longitude'=>122.04012,'confidence'=>93.7,'distance'=>4.8, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── San Roque ──────────────────────────────────────────────────
            ['haz_code'=>'HAZ-026','type'=>'Pothole',         'area'=>'San Roque','latitude'=>6.94037,'longitude'=>122.04770,'confidence'=>91.2,'distance'=>4.5, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-027','type'=>'Road Excavation', 'area'=>'San Roque','latitude'=>6.93895,'longitude'=>122.06454,'confidence'=>88.5,'distance'=>12.1,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-028','type'=>'Road Barrier',    'area'=>'San Roque','latitude'=>6.94216,'longitude'=>122.06669,'confidence'=>97.8,'distance'=>18.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-029','type'=>'Pothole',         'area'=>'San Roque','latitude'=>6.94142,'longitude'=>122.07148,'confidence'=>91.0,'distance'=>3.2, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-030','type'=>'Pothole',    'area'=>'San Roque','latitude'=>6.94311,'longitude'=>122.04546,'confidence'=>85.4,'distance'=>8.9, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-031','type'=>'Pothole',   'area'=>'San Roque','latitude'=>6.93829,'longitude'=>122.05657,'confidence'=>96.1,'distance'=>22.0,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-032','type'=>'Pothole',         'area'=>'San Roque','latitude'=>6.94236,'longitude'=>122.07246,'confidence'=>89.9,'distance'=>6.7, 'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-033','type'=>'Road Excavation', 'area'=>'San Roque','latitude'=>6.93790,'longitude'=>122.05498,'confidence'=>92.3,'distance'=>14.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-034','type'=>'Road Barrier',    'area'=>'San Roque','latitude'=>6.94409,'longitude'=>122.04258,'confidence'=>98.4,'distance'=>15.2,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-035','type'=>'Pothole',         'area'=>'San Roque','latitude'=>6.94298,'longitude'=>122.06828,'confidence'=>93.7,'distance'=>4.8, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Sta Maria ──────────────────────────────────────────────────
            ['haz_code'=>'HAZ-036','type'=>'Pothole',         'area'=>'Sta Maria','latitude'=>6.92788,'longitude'=>122.07393,'confidence'=>91.2,'distance'=>4.5, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-037','type'=>'Road Excavation', 'area'=>'Sta Maria','latitude'=>6.92141,'longitude'=>122.07508,'confidence'=>88.5,'distance'=>12.1,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-038','type'=>'Road Barrier',    'area'=>'Sta Maria','latitude'=>6.93997,'longitude'=>122.07409,'confidence'=>97.8,'distance'=>18.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-039','type'=>'Pothole',         'area'=>'Sta Maria','latitude'=>6.92937,'longitude'=>122.06162,'confidence'=>91.0,'distance'=>3.2, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-040','type'=>'Pothole',    'area'=>'Sta Maria','latitude'=>6.92246,'longitude'=>122.07451,'confidence'=>85.4,'distance'=>8.9, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-041','type'=>'Pothole',   'area'=>'Sta Maria','latitude'=>6.93569,'longitude'=>122.07878,'confidence'=>96.1,'distance'=>22.0,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-042','type'=>'Pothole',         'area'=>'Sta Maria','latitude'=>6.93146,'longitude'=>122.07246,'confidence'=>89.9,'distance'=>6.7, 'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-043','type'=>'Road Excavation', 'area'=>'Sta Maria','latitude'=>6.92120,'longitude'=>122.07238,'confidence'=>92.3,'distance'=>14.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-044','type'=>'Road Barrier',    'area'=>'Sta Maria','latitude'=>6.93053,'longitude'=>122.06718,'confidence'=>98.4,'distance'=>15.2,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-045','type'=>'Pothole',         'area'=>'Sta Maria','latitude'=>6.92045,'longitude'=>122.07201,'confidence'=>93.7,'distance'=>4.8, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Tugbungan ──────────────────────────────────────────────────
            ['haz_code'=>'HAZ-046','type'=>'Pothole',         'area'=>'Tugbungan','latitude'=>6.92285,'longitude'=>122.08078,'confidence'=>91.2,'distance'=>4.5, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-047','type'=>'Road Excavation', 'area'=>'Tugbungan','latitude'=>6.92062,'longitude'=>122.09501,'confidence'=>88.5,'distance'=>12.1,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-048','type'=>'Road Barrier',    'area'=>'Tugbungan','latitude'=>6.92212,'longitude'=>122.07975,'confidence'=>97.8,'distance'=>18.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-049','type'=>'Pothole',         'area'=>'Tugbungan','latitude'=>6.91580,'longitude'=>122.07596,'confidence'=>91.0,'distance'=>3.2, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-050','type'=>'Pothole',    'area'=>'Tugbungan','latitude'=>6.91571,'longitude'=>122.08711,'confidence'=>85.4,'distance'=>8.9, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-051','type'=>'Pothole',   'area'=>'Tugbungan','latitude'=>6.92580,'longitude'=>122.08425,'confidence'=>96.1,'distance'=>22.0,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-052','type'=>'Pothole',         'area'=>'Tugbungan','latitude'=>6.91771,'longitude'=>122.07922,'confidence'=>89.9,'distance'=>6.7, 'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-053','type'=>'Road Excavation', 'area'=>'Tugbungan','latitude'=>6.92371,'longitude'=>122.09002,'confidence'=>92.3,'distance'=>14.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-054','type'=>'Road Barrier',    'area'=>'Tugbungan','latitude'=>6.91965,'longitude'=>122.09142,'confidence'=>98.4,'distance'=>15.2,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-055','type'=>'Pothole',         'area'=>'Tugbungan','latitude'=>6.90920,'longitude'=>122.08665,'confidence'=>93.7,'distance'=>4.8, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Talon-Talon ────────────────────────────────────────────────
            ['haz_code'=>'HAZ-056','type'=>'Pothole',         'area'=>'Talon-Talon','latitude'=>6.91778,'longitude'=>122.09792,'confidence'=>91.2,'distance'=>4.5, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-057','type'=>'Road Excavation', 'area'=>'Talon-Talon','latitude'=>6.90959,'longitude'=>122.10030,'confidence'=>88.5,'distance'=>12.1,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-058','type'=>'Road Barrier',    'area'=>'Talon-Talon','latitude'=>6.91531,'longitude'=>122.10872,'confidence'=>97.8,'distance'=>18.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-059','type'=>'Pothole',         'area'=>'Talon-Talon','latitude'=>6.90968,'longitude'=>122.10662,'confidence'=>91.0,'distance'=>3.2, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-060','type'=>'Pothole',    'area'=>'Talon-Talon','latitude'=>6.90966,'longitude'=>122.10376,'confidence'=>85.4,'distance'=>8.9, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-061','type'=>'Pothole',   'area'=>'Talon-Talon','latitude'=>6.91331,'longitude'=>122.10858,'confidence'=>96.1,'distance'=>22.0,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-062','type'=>'Pothole',         'area'=>'Talon-Talon','latitude'=>6.91302,'longitude'=>122.09905,'confidence'=>89.9,'distance'=>6.7, 'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-063','type'=>'Road Excavation', 'area'=>'Talon-Talon','latitude'=>6.90945,'longitude'=>122.09530,'confidence'=>92.3,'distance'=>14.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-064','type'=>'Road Barrier',    'area'=>'Talon-Talon','latitude'=>6.90952,'longitude'=>122.09678,'confidence'=>98.4,'distance'=>15.2,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-065','type'=>'Pothole',         'area'=>'Talon-Talon','latitude'=>6.90951,'longitude'=>122.09645,'confidence'=>93.7,'distance'=>4.8, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Pasonanca ──────────────────────────────────────────────────
            ['haz_code'=>'HAZ-066','type'=>'Pothole',         'area'=>'Pasonanca','latitude'=>6.96029,'longitude'=>122.07248,'confidence'=>91.2,'distance'=>4.5, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-067','type'=>'Road Excavation', 'area'=>'Pasonanca','latitude'=>6.96092,'longitude'=>122.07278,'confidence'=>88.5,'distance'=>12.1,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-068','type'=>'Road Barrier',    'area'=>'Pasonanca','latitude'=>6.95118,'longitude'=>122.07176,'confidence'=>97.8,'distance'=>18.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-069','type'=>'Pothole',         'area'=>'Pasonanca','latitude'=>6.94563,'longitude'=>122.07303,'confidence'=>91.0,'distance'=>3.2, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-070','type'=>'Pothole',    'area'=>'Pasonanca','latitude'=>6.95474,'longitude'=>122.06687,'confidence'=>85.4,'distance'=>8.9, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-071','type'=>'Pothole',   'area'=>'Pasonanca','latitude'=>6.95239,'longitude'=>122.08206,'confidence'=>96.1,'distance'=>22.0,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-072','type'=>'Pothole',         'area'=>'Pasonanca','latitude'=>6.96555,'longitude'=>122.06151,'confidence'=>89.9,'distance'=>6.7, 'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-073','type'=>'Road Excavation', 'area'=>'Pasonanca','latitude'=>6.95321,'longitude'=>122.07143,'confidence'=>92.3,'distance'=>14.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-074','type'=>'Road Barrier',    'area'=>'Pasonanca','latitude'=>6.96605,'longitude'=>122.06242,'confidence'=>98.4,'distance'=>15.2,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-075','type'=>'Pothole',         'area'=>'Pasonanca','latitude'=>6.96581,'longitude'=>122.06361,'confidence'=>93.7,'distance'=>4.8, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Putik ──────────────────────────────────────────────────────
            ['haz_code'=>'HAZ-076','type'=>'Pothole',         'area'=>'Putik','latitude'=>6.93508,'longitude'=>122.11295,'confidence'=>91.2,'distance'=>4.5, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-077','type'=>'Road Excavation', 'area'=>'Putik','latitude'=>6.92303,'longitude'=>122.10443,'confidence'=>88.5,'distance'=>12.1,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-078','type'=>'Road Barrier',    'area'=>'Putik','latitude'=>6.94429,'longitude'=>122.09714,'confidence'=>97.8,'distance'=>18.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-079','type'=>'Pothole',         'area'=>'Putik','latitude'=>6.94176,'longitude'=>122.11641,'confidence'=>91.0,'distance'=>3.2, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-080','type'=>'Pothole',    'area'=>'Putik','latitude'=>6.94885,'longitude'=>122.10673,'confidence'=>85.4,'distance'=>8.9, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-081','type'=>'Pothole',   'area'=>'Putik','latitude'=>6.92885,'longitude'=>122.08914,'confidence'=>96.1,'distance'=>22.0,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-082','type'=>'Pothole',         'area'=>'Putik','latitude'=>6.92235,'longitude'=>122.09997,'confidence'=>89.9,'distance'=>6.7, 'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-083','type'=>'Road Excavation', 'area'=>'Putik','latitude'=>6.92181,'longitude'=>122.09999,'confidence'=>92.3,'distance'=>14.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-084','type'=>'Road Barrier',    'area'=>'Putik','latitude'=>6.94679,'longitude'=>122.10039,'confidence'=>98.4,'distance'=>15.2,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-085','type'=>'Pothole',         'area'=>'Putik','latitude'=>6.92887,'longitude'=>122.08770,'confidence'=>93.7,'distance'=>4.8, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Tumaga ─────────────────────────────────────────────────────
            ['haz_code'=>'HAZ-086','type'=>'Pothole',         'area'=>'Tumaga','latitude'=>6.94316,'longitude'=>122.07309,'confidence'=>91.2,'distance'=>4.5, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-087','type'=>'Road Excavation', 'area'=>'Tumaga','latitude'=>6.93994,'longitude'=>122.07622,'confidence'=>88.5,'distance'=>12.1,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-088','type'=>'Road Barrier',    'area'=>'Tumaga','latitude'=>6.94057,'longitude'=>122.08030,'confidence'=>97.8,'distance'=>18.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-089','type'=>'Pothole',         'area'=>'Tumaga','latitude'=>6.95247,'longitude'=>122.08554,'confidence'=>91.0,'distance'=>3.2, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-090','type'=>'Pothole',    'area'=>'Tumaga','latitude'=>6.94348,'longitude'=>122.09218,'confidence'=>85.4,'distance'=>8.9, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-091','type'=>'Pothole',   'area'=>'Tumaga','latitude'=>6.94673,'longitude'=>122.09111,'confidence'=>96.1,'distance'=>22.0,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-092','type'=>'Pothole',         'area'=>'Tumaga','latitude'=>6.94496,'longitude'=>122.08553,'confidence'=>89.9,'distance'=>6.7, 'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-093','type'=>'Road Excavation', 'area'=>'Tumaga','latitude'=>6.94575,'longitude'=>122.09129,'confidence'=>92.3,'distance'=>14.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-094','type'=>'Road Barrier',    'area'=>'Tumaga','latitude'=>6.94316,'longitude'=>122.09410,'confidence'=>98.4,'distance'=>15.2,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-095','type'=>'Pothole',         'area'=>'Tumaga','latitude'=>6.94303,'longitude'=>122.09360,'confidence'=>93.7,'distance'=>4.8, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Lunzuran ───────────────────────────────────────────────────
            ['haz_code'=>'HAZ-096','type'=>'Pothole',         'area'=>'Lunzuran','latitude'=>6.97407,'longitude'=>122.09640,'confidence'=>91.2,'distance'=>4.5, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-097','type'=>'Road Excavation', 'area'=>'Lunzuran','latitude'=>6.95447,'longitude'=>122.09472,'confidence'=>88.5,'distance'=>12.1,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-098','type'=>'Road Barrier',    'area'=>'Lunzuran','latitude'=>6.96805,'longitude'=>122.10248,'confidence'=>97.8,'distance'=>18.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-099','type'=>'Pothole',         'area'=>'Lunzuran','latitude'=>6.95495,'longitude'=>122.09335,'confidence'=>91.0,'distance'=>3.2, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-100','type'=>'Pothole',    'area'=>'Lunzuran','latitude'=>6.96241,'longitude'=>122.09675,'confidence'=>85.4,'distance'=>8.9, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-101','type'=>'Pothole',   'area'=>'Lunzuran','latitude'=>6.95388,'longitude'=>122.10417,'confidence'=>96.1,'distance'=>22.0,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-102','type'=>'Pothole',         'area'=>'Lunzuran','latitude'=>6.96212,'longitude'=>122.10157,'confidence'=>89.9,'distance'=>6.7, 'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-103','type'=>'Road Excavation', 'area'=>'Lunzuran','latitude'=>6.95265,'longitude'=>122.10435,'confidence'=>92.3,'distance'=>14.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-104','type'=>'Road Barrier',    'area'=>'Lunzuran','latitude'=>6.95609,'longitude'=>122.09617,'confidence'=>98.4,'distance'=>15.2,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-105','type'=>'Pothole',         'area'=>'Lunzuran','latitude'=>6.96198,'longitude'=>122.10164,'confidence'=>93.7,'distance'=>4.8, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Baliwasan ──────────────────────────────────────────────────
            ['haz_code'=>'HAZ-106','type'=>'Pothole',         'area'=>'Baliwasan','latitude'=>6.91406,'longitude'=>122.06271,'confidence'=>91.2,'distance'=>4.5, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-107','type'=>'Road Excavation', 'area'=>'Baliwasan','latitude'=>6.91951,'longitude'=>122.05374,'confidence'=>88.5,'distance'=>12.1,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-108','type'=>'Road Barrier',    'area'=>'Baliwasan','latitude'=>6.91766,'longitude'=>122.06188,'confidence'=>97.8,'distance'=>18.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-109','type'=>'Pothole',         'area'=>'Baliwasan','latitude'=>6.91658,'longitude'=>122.06782,'confidence'=>91.0,'distance'=>3.2, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-110','type'=>'Pothole',    'area'=>'Baliwasan','latitude'=>6.91835,'longitude'=>122.06279,'confidence'=>85.4,'distance'=>8.9, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-111','type'=>'Pothole',   'area'=>'Baliwasan','latitude'=>6.91673,'longitude'=>122.06701,'confidence'=>96.1,'distance'=>22.0,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-112','type'=>'Pothole',         'area'=>'Baliwasan','latitude'=>6.91840,'longitude'=>122.06262,'confidence'=>89.9,'distance'=>6.7, 'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-113','type'=>'Road Excavation', 'area'=>'Baliwasan','latitude'=>6.91630,'longitude'=>122.06027,'confidence'=>92.3,'distance'=>14.5,'rider_code'=>'RIDER-002','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-114','type'=>'Road Barrier',    'area'=>'Baliwasan','latitude'=>6.91829,'longitude'=>122.06279,'confidence'=>98.4,'distance'=>15.2,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-115','type'=>'Pothole',         'area'=>'Baliwasan','latitude'=>6.91167,'longitude'=>122.06089,'confidence'=>93.7,'distance'=>4.8, 'rider_code'=>'RIDER-003','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── San Jose Gusu ──────────────────────────────────────────────
            ['haz_code'=>'HAZ-116','type'=>'Pothole',         'area'=>'San Jose Gusu','latitude'=>6.92311,'longitude'=>122.04707,'confidence'=>91.2,'distance'=>4.5, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-117','type'=>'Road Excavation', 'area'=>'San Jose Gusu','latitude'=>6.92752,'longitude'=>122.05202,'confidence'=>88.5,'distance'=>12.1,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-118','type'=>'Road Barrier',    'area'=>'San Jose Gusu','latitude'=>6.92048,'longitude'=>122.04777,'confidence'=>97.8,'distance'=>18.5,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-119','type'=>'Pothole',         'area'=>'San Jose Gusu','latitude'=>6.92750,'longitude'=>122.05258,'confidence'=>91.0,'distance'=>3.2, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-120','type'=>'Pothole',    'area'=>'San Jose Gusu','latitude'=>6.92941,'longitude'=>122.04761,'confidence'=>85.4,'distance'=>8.9, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-121','type'=>'Pothole',   'area'=>'San Jose Gusu','latitude'=>6.92375,'longitude'=>122.04703,'confidence'=>96.1,'distance'=>22.0,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-122','type'=>'Pothole',         'area'=>'San Jose Gusu','latitude'=>6.93008,'longitude'=>122.04691,'confidence'=>89.9,'distance'=>6.7, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-123','type'=>'Road Excavation', 'area'=>'San Jose Gusu','latitude'=>6.93137,'longitude'=>122.04565,'confidence'=>92.3,'distance'=>14.5,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-124','type'=>'Road Barrier',    'area'=>'San Jose Gusu','latitude'=>6.92366,'longitude'=>122.04701,'confidence'=>98.4,'distance'=>15.2,'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-125','type'=>'Pothole',         'area'=>'San Jose Gusu','latitude'=>6.92781,'longitude'=>122.04718,'confidence'=>93.7,'distance'=>4.8, 'rider_code'=>'RIDER-001','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],
        ];

        foreach ($records as $record) {
            HazardLog::updateOrCreate(
                ['haz_code' => $record['haz_code']],
                $record
            );
        }

        $this->command->info('✅ HazardLogSeeder: ' . count($records) . ' records seeded.');
    }
}
