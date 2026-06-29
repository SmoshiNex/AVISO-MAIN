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
            ['haz_code'=>'HAZ-001','type'=>'Pothole',         'area'=>'City Proper','latitude'=>6.90564,'longitude'=>122.07683,'confidence'=>91.1,'distance'=>4.5, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-002','type'=>'Road Excavation', 'area'=>'City Proper','latitude'=>6.90168,'longitude'=>122.07432,'confidence'=>91.8,'distance'=>12.1,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-003','type'=>'Road Barrier',    'area'=>'City Proper','latitude'=>6.90701,'longitude'=>122.07194,'confidence'=>90.0,'distance'=>18.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-004','type'=>'Pothole',         'area'=>'City Proper','latitude'=>6.90660,'longitude'=>122.07593,'confidence'=>90.3,'distance'=>3.2, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-005','type'=>'Pothole',    'area'=>'City Proper','latitude'=>6.90981,'longitude'=>122.06905,'confidence'=>91.3,'distance'=>8.9, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-006','type'=>'Pothole',   'area'=>'City Proper','latitude'=>6.90728,'longitude'=>122.07397,'confidence'=>91.6,'distance'=>22.0,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-007','type'=>'Pothole',         'area'=>'City Proper','latitude'=>6.90607,'longitude'=>122.06922,'confidence'=>91.7,'distance'=>6.7, 'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-008','type'=>'Road Excavation', 'area'=>'City Proper','latitude'=>6.90403,'longitude'=>122.07903,'confidence'=>91.8,'distance'=>14.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-009','type'=>'Road Barrier',    'area'=>'City Proper','latitude'=>6.90513,'longitude'=>122.07654,'confidence'=>91.1,'distance'=>15.2,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-010','type'=>'Pothole',         'area'=>'City Proper','latitude'=>6.90849,'longitude'=>122.07087,'confidence'=>90.8,'distance'=>4.8, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],
            ['haz_code'=>'HAZ-011','type'=>'Road Excavation', 'area'=>'City Proper','latitude'=>6.90620,'longitude'=>122.06934,'confidence'=>90.6,'distance'=>10.1,'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 15:45:11'],
            ['haz_code'=>'HAZ-012','type'=>'Pothole',    'area'=>'City Proper','latitude'=>6.90733,'longitude'=>122.07377,'confidence'=>92.0,'distance'=>5.5, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 16:15:22'],
            ['haz_code'=>'HAZ-013','type'=>'Pothole',         'area'=>'City Proper','latitude'=>6.90638,'longitude'=>122.06909,'confidence'=>90.3,'distance'=>2.1, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 16:30:00'],
            ['haz_code'=>'HAZ-014','type'=>'Road Barrier',    'area'=>'City Proper','latitude'=>6.90729,'longitude'=>122.07788,'confidence'=>91.3,'distance'=>14.3,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 17:10:45'],
            ['haz_code'=>'HAZ-015','type'=>'Pothole',   'area'=>'City Proper','latitude'=>6.90474,'longitude'=>122.07545,'confidence'=>90.5,'distance'=>16.8,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 17:25:14'],

            // ── Calarian ───────────────────────────────────────────────────
            ['haz_code'=>'HAZ-016','type'=>'Pothole',         'area'=>'Calarian','latitude'=>6.93906,'longitude'=>122.04339,'confidence'=>90.1,'distance'=>4.5, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-017','type'=>'Road Excavation', 'area'=>'Calarian','latitude'=>6.93601,'longitude'=>122.04098,'confidence'=>90.4,'distance'=>12.1,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-018','type'=>'Road Barrier',    'area'=>'Calarian','latitude'=>6.92629,'longitude'=>122.02459,'confidence'=>91.1,'distance'=>18.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-019','type'=>'Pothole',         'area'=>'Calarian','latitude'=>6.93698,'longitude'=>122.03656,'confidence'=>92.5,'distance'=>3.2, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-020','type'=>'Pothole',    'area'=>'Calarian','latitude'=>6.93855,'longitude'=>122.02580,'confidence'=>92.7,'distance'=>8.9, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-021','type'=>'Pothole',   'area'=>'Calarian','latitude'=>6.93904,'longitude'=>122.02472,'confidence'=>90.3,'distance'=>22.0,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-022','type'=>'Pothole',         'area'=>'Calarian','latitude'=>6.92827,'longitude'=>122.02460,'confidence'=>91.9,'distance'=>6.7, 'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-023','type'=>'Road Excavation', 'area'=>'Calarian','latitude'=>6.92516,'longitude'=>122.02781,'confidence'=>92.8,'distance'=>14.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-024','type'=>'Road Barrier',    'area'=>'Calarian','latitude'=>6.94171,'longitude'=>122.03112,'confidence'=>92.6,'distance'=>15.2,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-025','type'=>'Pothole',         'area'=>'Calarian','latitude'=>6.93600,'longitude'=>122.04012,'confidence'=>90.9,'distance'=>4.8, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── San Roque ──────────────────────────────────────────────────
            ['haz_code'=>'HAZ-026','type'=>'Pothole',         'area'=>'San Roque','latitude'=>6.94037,'longitude'=>122.04770,'confidence'=>91.6,'distance'=>4.5, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-027','type'=>'Road Excavation', 'area'=>'San Roque','latitude'=>6.93895,'longitude'=>122.06454,'confidence'=>91.3,'distance'=>12.1,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-028','type'=>'Road Barrier',    'area'=>'San Roque','latitude'=>6.94216,'longitude'=>122.06669,'confidence'=>91.2,'distance'=>18.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-029','type'=>'Pothole',         'area'=>'San Roque','latitude'=>6.94142,'longitude'=>122.07148,'confidence'=>92.1,'distance'=>3.2, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-030','type'=>'Pothole',    'area'=>'San Roque','latitude'=>6.94311,'longitude'=>122.04546,'confidence'=>91.8,'distance'=>8.9, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-031','type'=>'Pothole',   'area'=>'San Roque','latitude'=>6.93829,'longitude'=>122.05657,'confidence'=>90.8,'distance'=>22.0,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-032','type'=>'Pothole',         'area'=>'San Roque','latitude'=>6.94236,'longitude'=>122.07246,'confidence'=>92.8,'distance'=>6.7, 'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-033','type'=>'Road Excavation', 'area'=>'San Roque','latitude'=>6.93790,'longitude'=>122.05498,'confidence'=>91.6,'distance'=>14.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-034','type'=>'Road Barrier',    'area'=>'San Roque','latitude'=>6.94409,'longitude'=>122.04258,'confidence'=>92.7,'distance'=>15.2,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-035','type'=>'Pothole',         'area'=>'San Roque','latitude'=>6.94298,'longitude'=>122.06828,'confidence'=>91.7,'distance'=>4.8, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Sta Maria ──────────────────────────────────────────────────
            ['haz_code'=>'HAZ-036','type'=>'Pothole',         'area'=>'Sta Maria','latitude'=>6.92788,'longitude'=>122.07393,'confidence'=>91.1,'distance'=>4.5, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-037','type'=>'Road Excavation', 'area'=>'Sta Maria','latitude'=>6.92141,'longitude'=>122.07508,'confidence'=>90.2,'distance'=>12.1,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-038','type'=>'Road Barrier',    'area'=>'Sta Maria','latitude'=>6.93997,'longitude'=>122.07409,'confidence'=>90.2,'distance'=>18.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-039','type'=>'Pothole',         'area'=>'Sta Maria','latitude'=>6.92937,'longitude'=>122.06162,'confidence'=>91.1,'distance'=>3.2, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-040','type'=>'Pothole',    'area'=>'Sta Maria','latitude'=>6.92246,'longitude'=>122.07451,'confidence'=>91.0,'distance'=>8.9, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-041','type'=>'Pothole',   'area'=>'Sta Maria','latitude'=>6.93569,'longitude'=>122.07878,'confidence'=>90.9,'distance'=>22.0,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-042','type'=>'Pothole',         'area'=>'Sta Maria','latitude'=>6.93146,'longitude'=>122.07246,'confidence'=>91.3,'distance'=>6.7, 'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-043','type'=>'Road Excavation', 'area'=>'Sta Maria','latitude'=>6.92120,'longitude'=>122.07238,'confidence'=>92.2,'distance'=>14.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-044','type'=>'Road Barrier',    'area'=>'Sta Maria','latitude'=>6.93053,'longitude'=>122.06718,'confidence'=>90.1,'distance'=>15.2,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-045','type'=>'Pothole',         'area'=>'Sta Maria','latitude'=>6.92045,'longitude'=>122.07201,'confidence'=>92.4,'distance'=>4.8, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Tugbungan ──────────────────────────────────────────────────
            ['haz_code'=>'HAZ-046','type'=>'Pothole',         'area'=>'Tugbungan','latitude'=>6.92285,'longitude'=>122.08078,'confidence'=>91.3,'distance'=>4.5, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-047','type'=>'Road Excavation', 'area'=>'Tugbungan','latitude'=>6.92062,'longitude'=>122.09501,'confidence'=>91.2,'distance'=>12.1,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-048','type'=>'Road Barrier',    'area'=>'Tugbungan','latitude'=>6.92212,'longitude'=>122.07975,'confidence'=>92.1,'distance'=>18.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-049','type'=>'Pothole',         'area'=>'Tugbungan','latitude'=>6.91580,'longitude'=>122.07596,'confidence'=>90.3,'distance'=>3.2, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-050','type'=>'Pothole',    'area'=>'Tugbungan','latitude'=>6.91571,'longitude'=>122.08711,'confidence'=>92.3,'distance'=>8.9, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-051','type'=>'Pothole',   'area'=>'Tugbungan','latitude'=>6.92580,'longitude'=>122.08425,'confidence'=>90.4,'distance'=>22.0,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-052','type'=>'Pothole',         'area'=>'Tugbungan','latitude'=>6.91771,'longitude'=>122.07922,'confidence'=>92.2,'distance'=>6.7, 'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-053','type'=>'Road Excavation', 'area'=>'Tugbungan','latitude'=>6.92371,'longitude'=>122.09002,'confidence'=>91.5,'distance'=>14.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-054','type'=>'Road Barrier',    'area'=>'Tugbungan','latitude'=>6.91965,'longitude'=>122.09142,'confidence'=>92.4,'distance'=>15.2,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-055','type'=>'Pothole',         'area'=>'Tugbungan','latitude'=>6.90920,'longitude'=>122.08665,'confidence'=>91.6,'distance'=>4.8, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Talon-Talon ────────────────────────────────────────────────
            ['haz_code'=>'HAZ-056','type'=>'Pothole',         'area'=>'Talon-Talon','latitude'=>6.91778,'longitude'=>122.09792,'confidence'=>90.3,'distance'=>4.5, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-057','type'=>'Road Excavation', 'area'=>'Talon-Talon','latitude'=>6.90959,'longitude'=>122.10030,'confidence'=>91.2,'distance'=>12.1,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-058','type'=>'Road Barrier',    'area'=>'Talon-Talon','latitude'=>6.91531,'longitude'=>122.10872,'confidence'=>91.6,'distance'=>18.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-059','type'=>'Pothole',         'area'=>'Talon-Talon','latitude'=>6.90968,'longitude'=>122.10662,'confidence'=>92.5,'distance'=>3.2, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-060','type'=>'Pothole',    'area'=>'Talon-Talon','latitude'=>6.90966,'longitude'=>122.10376,'confidence'=>90.4,'distance'=>8.9, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-061','type'=>'Pothole',   'area'=>'Talon-Talon','latitude'=>6.91331,'longitude'=>122.10858,'confidence'=>92.9,'distance'=>22.0,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-062','type'=>'Pothole',         'area'=>'Talon-Talon','latitude'=>6.91302,'longitude'=>122.09905,'confidence'=>90.3,'distance'=>6.7, 'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-063','type'=>'Road Excavation', 'area'=>'Talon-Talon','latitude'=>6.90945,'longitude'=>122.09530,'confidence'=>90.2,'distance'=>14.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-064','type'=>'Road Barrier',    'area'=>'Talon-Talon','latitude'=>6.90952,'longitude'=>122.09678,'confidence'=>93.0,'distance'=>15.2,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-065','type'=>'Pothole',         'area'=>'Talon-Talon','latitude'=>6.90951,'longitude'=>122.09645,'confidence'=>92.6,'distance'=>4.8, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Pasonanca ──────────────────────────────────────────────────
            ['haz_code'=>'HAZ-066','type'=>'Pothole',         'area'=>'Pasonanca','latitude'=>6.96029,'longitude'=>122.07248,'confidence'=>90.5,'distance'=>4.5, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-067','type'=>'Road Excavation', 'area'=>'Pasonanca','latitude'=>6.96092,'longitude'=>122.07278,'confidence'=>91.3,'distance'=>12.1,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-068','type'=>'Road Barrier',    'area'=>'Pasonanca','latitude'=>6.95118,'longitude'=>122.07176,'confidence'=>90.4,'distance'=>18.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-069','type'=>'Pothole',         'area'=>'Pasonanca','latitude'=>6.94563,'longitude'=>122.07303,'confidence'=>92.4,'distance'=>3.2, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-070','type'=>'Pothole',    'area'=>'Pasonanca','latitude'=>6.95474,'longitude'=>122.06687,'confidence'=>90.5,'distance'=>8.9, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-071','type'=>'Pothole',   'area'=>'Pasonanca','latitude'=>6.95239,'longitude'=>122.08206,'confidence'=>93.0,'distance'=>22.0,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-072','type'=>'Pothole',         'area'=>'Pasonanca','latitude'=>6.96555,'longitude'=>122.06151,'confidence'=>90.3,'distance'=>6.7, 'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-073','type'=>'Road Excavation', 'area'=>'Pasonanca','latitude'=>6.95321,'longitude'=>122.07143,'confidence'=>91.6,'distance'=>14.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-074','type'=>'Road Barrier',    'area'=>'Pasonanca','latitude'=>6.96605,'longitude'=>122.06242,'confidence'=>90.5,'distance'=>15.2,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-075','type'=>'Pothole',         'area'=>'Pasonanca','latitude'=>6.96581,'longitude'=>122.06361,'confidence'=>91.4,'distance'=>4.8, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Putik ──────────────────────────────────────────────────────
            ['haz_code'=>'HAZ-076','type'=>'Pothole',         'area'=>'Putik','latitude'=>6.93508,'longitude'=>122.11295,'confidence'=>91.3,'distance'=>4.5, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-077','type'=>'Road Excavation', 'area'=>'Putik','latitude'=>6.92303,'longitude'=>122.10443,'confidence'=>91.3,'distance'=>12.1,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-078','type'=>'Road Barrier',    'area'=>'Putik','latitude'=>6.94429,'longitude'=>122.09714,'confidence'=>91.3,'distance'=>18.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-079','type'=>'Pothole',         'area'=>'Putik','latitude'=>6.94176,'longitude'=>122.11641,'confidence'=>91.8,'distance'=>3.2, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-080','type'=>'Pothole',    'area'=>'Putik','latitude'=>6.94885,'longitude'=>122.10673,'confidence'=>92.4,'distance'=>8.9, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-081','type'=>'Pothole',   'area'=>'Putik','latitude'=>6.92885,'longitude'=>122.08914,'confidence'=>92.5,'distance'=>22.0,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-082','type'=>'Pothole',         'area'=>'Putik','latitude'=>6.92235,'longitude'=>122.09997,'confidence'=>91.6,'distance'=>6.7, 'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-083','type'=>'Road Excavation', 'area'=>'Putik','latitude'=>6.92181,'longitude'=>122.09999,'confidence'=>91.4,'distance'=>14.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-084','type'=>'Road Barrier',    'area'=>'Putik','latitude'=>6.94679,'longitude'=>122.10039,'confidence'=>90.3,'distance'=>15.2,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-085','type'=>'Pothole',         'area'=>'Putik','latitude'=>6.92887,'longitude'=>122.08770,'confidence'=>92.6,'distance'=>4.8, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Tumaga ─────────────────────────────────────────────────────
            ['haz_code'=>'HAZ-086','type'=>'Pothole',         'area'=>'Tumaga','latitude'=>6.94316,'longitude'=>122.07309,'confidence'=>92.1,'distance'=>4.5, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-087','type'=>'Road Excavation', 'area'=>'Tumaga','latitude'=>6.93994,'longitude'=>122.07622,'confidence'=>92.7,'distance'=>12.1,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-088','type'=>'Road Barrier',    'area'=>'Tumaga','latitude'=>6.94057,'longitude'=>122.08030,'confidence'=>91.2,'distance'=>18.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-089','type'=>'Pothole',         'area'=>'Tumaga','latitude'=>6.95247,'longitude'=>122.08554,'confidence'=>92.3,'distance'=>3.2, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-090','type'=>'Pothole',    'area'=>'Tumaga','latitude'=>6.94348,'longitude'=>122.09218,'confidence'=>90.9,'distance'=>8.9, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-091','type'=>'Pothole',   'area'=>'Tumaga','latitude'=>6.94673,'longitude'=>122.09111,'confidence'=>90.1,'distance'=>22.0,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-092','type'=>'Pothole',         'area'=>'Tumaga','latitude'=>6.94496,'longitude'=>122.08553,'confidence'=>92.5,'distance'=>6.7, 'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-093','type'=>'Road Excavation', 'area'=>'Tumaga','latitude'=>6.94575,'longitude'=>122.09129,'confidence'=>90.4,'distance'=>14.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-094','type'=>'Road Barrier',    'area'=>'Tumaga','latitude'=>6.94316,'longitude'=>122.09410,'confidence'=>91.4,'distance'=>15.2,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-095','type'=>'Pothole',         'area'=>'Tumaga','latitude'=>6.94303,'longitude'=>122.09360,'confidence'=>91.4,'distance'=>4.8, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Lunzuran ───────────────────────────────────────────────────
            ['haz_code'=>'HAZ-096','type'=>'Pothole',         'area'=>'Lunzuran','latitude'=>6.97407,'longitude'=>122.09640,'confidence'=>92.1,'distance'=>4.5, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-097','type'=>'Road Excavation', 'area'=>'Lunzuran','latitude'=>6.95447,'longitude'=>122.09472,'confidence'=>91.4,'distance'=>12.1,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-098','type'=>'Road Barrier',    'area'=>'Lunzuran','latitude'=>6.96805,'longitude'=>122.10248,'confidence'=>91.7,'distance'=>18.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-099','type'=>'Pothole',         'area'=>'Lunzuran','latitude'=>6.95495,'longitude'=>122.09335,'confidence'=>90.6,'distance'=>3.2, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-100','type'=>'Pothole',    'area'=>'Lunzuran','latitude'=>6.96241,'longitude'=>122.09675,'confidence'=>92.0,'distance'=>8.9, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-101','type'=>'Pothole',   'area'=>'Lunzuran','latitude'=>6.95388,'longitude'=>122.10417,'confidence'=>92.2,'distance'=>22.0,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-102','type'=>'Pothole',         'area'=>'Lunzuran','latitude'=>6.96212,'longitude'=>122.10157,'confidence'=>91.4,'distance'=>6.7, 'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-103','type'=>'Road Excavation', 'area'=>'Lunzuran','latitude'=>6.95265,'longitude'=>122.10435,'confidence'=>90.7,'distance'=>14.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-104','type'=>'Road Barrier',    'area'=>'Lunzuran','latitude'=>6.95609,'longitude'=>122.09617,'confidence'=>91.7,'distance'=>15.2,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-105','type'=>'Pothole',         'area'=>'Lunzuran','latitude'=>6.96198,'longitude'=>122.10164,'confidence'=>90.8,'distance'=>4.8, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Baliwasan ──────────────────────────────────────────────────
            ['haz_code'=>'HAZ-106','type'=>'Pothole',         'area'=>'Baliwasan','latitude'=>6.91406,'longitude'=>122.06271,'confidence'=>92.1,'distance'=>4.5, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-107','type'=>'Road Excavation', 'area'=>'Baliwasan','latitude'=>6.91951,'longitude'=>122.05374,'confidence'=>91.6,'distance'=>12.1,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-108','type'=>'Road Barrier',    'area'=>'Baliwasan','latitude'=>6.91766,'longitude'=>122.06188,'confidence'=>90.0,'distance'=>18.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-109','type'=>'Pothole',         'area'=>'Baliwasan','latitude'=>6.91658,'longitude'=>122.06782,'confidence'=>92.3,'distance'=>3.2, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-110','type'=>'Pothole',    'area'=>'Baliwasan','latitude'=>6.91835,'longitude'=>122.06279,'confidence'=>90.4,'distance'=>8.9, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-111','type'=>'Pothole',   'area'=>'Baliwasan','latitude'=>6.91673,'longitude'=>122.06701,'confidence'=>91.5,'distance'=>22.0,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-112','type'=>'Pothole',         'area'=>'Baliwasan','latitude'=>6.91840,'longitude'=>122.06262,'confidence'=>91.4,'distance'=>6.7, 'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-113','type'=>'Road Excavation', 'area'=>'Baliwasan','latitude'=>6.91630,'longitude'=>122.06027,'confidence'=>92.4,'distance'=>14.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-114','type'=>'Road Barrier',    'area'=>'Baliwasan','latitude'=>6.91829,'longitude'=>122.06279,'confidence'=>91.5,'distance'=>15.2,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-115','type'=>'Pothole',         'area'=>'Baliwasan','latitude'=>6.91167,'longitude'=>122.06089,'confidence'=>91.0,'distance'=>4.8, 'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── San Jose Gusu ──────────────────────────────────────────────
            ['haz_code'=>'HAZ-116','type'=>'Pothole',         'area'=>'San Jose Gusu','latitude'=>6.92311,'longitude'=>122.04707,'confidence'=>91.8,'distance'=>4.5, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 08:15:22'],
            ['haz_code'=>'HAZ-117','type'=>'Road Excavation', 'area'=>'San Jose Gusu','latitude'=>6.92752,'longitude'=>122.05202,'confidence'=>92.1,'distance'=>12.1,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 09:02:11'],
            ['haz_code'=>'HAZ-118','type'=>'Road Barrier',    'area'=>'San Jose Gusu','latitude'=>6.92048,'longitude'=>122.04777,'confidence'=>91.4,'distance'=>18.5,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 09:15:44'],
            ['haz_code'=>'HAZ-119','type'=>'Pothole',         'area'=>'San Jose Gusu','latitude'=>6.92750,'longitude'=>122.05258,'confidence'=>92.3,'distance'=>3.2, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 10:45:00'],
            ['haz_code'=>'HAZ-120','type'=>'Pothole',    'area'=>'San Jose Gusu','latitude'=>6.92941,'longitude'=>122.04761,'confidence'=>90.7,'distance'=>8.9, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 11:20:33'],
            ['haz_code'=>'HAZ-121','type'=>'Pothole',   'area'=>'San Jose Gusu','latitude'=>6.92375,'longitude'=>122.04703,'confidence'=>90.0,'distance'=>22.0,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 12:05:12'],
            ['haz_code'=>'HAZ-122','type'=>'Pothole',         'area'=>'San Jose Gusu','latitude'=>6.93008,'longitude'=>122.04691,'confidence'=>92.2,'distance'=>6.7, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 13:10:45'],
            ['haz_code'=>'HAZ-123','type'=>'Road Excavation', 'area'=>'San Jose Gusu','latitude'=>6.93137,'longitude'=>122.04565,'confidence'=>91.9,'distance'=>14.5,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 13:45:22'],
            ['haz_code'=>'HAZ-124','type'=>'Road Barrier',    'area'=>'San Jose Gusu','latitude'=>6.92366,'longitude'=>122.04701,'confidence'=>90.6,'distance'=>15.2,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 14:22:18'],
            ['haz_code'=>'HAZ-125','type'=>'Pothole',         'area'=>'San Jose Gusu','latitude'=>6.92781,'longitude'=>122.04718,'confidence'=>90.7,'distance'=>4.8, 'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 15:05:30'],

            // ── Traffic Signs ──────────────────────────────────────────────
            ['haz_code'=>'TS-001','type'=>'Traffic Sign','area'=>'City Proper', 'latitude'=>6.90612,'longitude'=>122.07341,'confidence'=>88.5,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-11 08:20:00'],
            ['haz_code'=>'TS-002','type'=>'Traffic Sign','area'=>'Calarian',    'latitude'=>6.93712,'longitude'=>122.03890,'confidence'=>87.9,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-11 14:30:00'],
            ['haz_code'=>'TS-003','type'=>'Traffic Sign','area'=>'San Roque',   'latitude'=>6.94120,'longitude'=>122.05910,'confidence'=>89.2,'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-12 09:15:00'],
            ['haz_code'=>'TS-004','type'=>'Traffic Sign','area'=>'Tugbungan',   'latitude'=>6.92110,'longitude'=>122.08340,'confidence'=>88.1,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-12 16:45:00'],
            ['haz_code'=>'TS-005','type'=>'Traffic Sign','area'=>'Talon-Talon', 'latitude'=>6.91045,'longitude'=>122.10120,'confidence'=>89.7,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 11:10:00'],
            ['haz_code'=>'TS-006','type'=>'Traffic Sign','area'=>'Pasonanca',   'latitude'=>6.95880,'longitude'=>122.07560,'confidence'=>87.3,'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-14 08:55:00'],
            ['haz_code'=>'TS-007','type'=>'Traffic Sign','area'=>'Lunzuran',    'latitude'=>6.96310,'longitude'=>122.09980,'confidence'=>88.8,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-15 10:30:00'],
            ['haz_code'=>'TS-008','type'=>'Traffic Sign','area'=>'Baliwasan',   'latitude'=>6.91720,'longitude'=>122.06450,'confidence'=>89.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-16 09:00:00'],
            ['haz_code'=>'TS-009','type'=>'Traffic Sign','area'=>'Tumaga',      'latitude'=>6.94520,'longitude'=>122.08770,'confidence'=>87.6,'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-17 08:10:00'],
            ['haz_code'=>'TS-010','type'=>'Traffic Sign','area'=>'City Proper', 'latitude'=>6.90890,'longitude'=>122.07820,'confidence'=>90.1,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-17 13:40:00'],

            // ── Traffic Light Red ──────────────────────────────────────────
            ['haz_code'=>'TL-R01','type'=>'Traffic Light Red','area'=>'City Proper', 'latitude'=>6.90540,'longitude'=>122.07520,'confidence'=>91.4,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-11 07:45:00'],
            ['haz_code'=>'TL-R02','type'=>'Traffic Light Red','area'=>'Calarian',    'latitude'=>6.93780,'longitude'=>122.04010,'confidence'=>90.8,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-12 13:20:00'],
            ['haz_code'=>'TL-R03','type'=>'Traffic Light Red','area'=>'San Roque',   'latitude'=>6.94050,'longitude'=>122.05230,'confidence'=>92.1,'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-13 08:30:00'],
            ['haz_code'=>'TL-R04','type'=>'Traffic Light Red','area'=>'Tugbungan',   'latitude'=>6.92440,'longitude'=>122.09010,'confidence'=>91.7,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-14 10:00:00'],
            ['haz_code'=>'TL-R05','type'=>'Traffic Light Red','area'=>'Talon-Talon', 'latitude'=>6.91200,'longitude'=>122.10450,'confidence'=>90.3,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-15 11:15:00'],
            ['haz_code'=>'TL-R06','type'=>'Traffic Light Red','area'=>'Pasonanca',   'latitude'=>6.96010,'longitude'=>122.07010,'confidence'=>91.9,'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-16 07:50:00'],
            ['haz_code'=>'TL-R07','type'=>'Traffic Light Red','area'=>'Lunzuran',    'latitude'=>6.96820,'longitude'=>122.10100,'confidence'=>90.6,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-17 09:00:00'],
            ['haz_code'=>'TL-R08','type'=>'Traffic Light Red','area'=>'Baliwasan',   'latitude'=>6.91580,'longitude'=>122.06310,'confidence'=>92.3,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-17 14:30:00'],

            // ── Traffic Light Orange ───────────────────────────────────────
            ['haz_code'=>'TL-O01','type'=>'Traffic Light Orange','area'=>'City Proper', 'latitude'=>6.90670,'longitude'=>122.07250,'confidence'=>89.8,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-11 09:10:00'],
            ['haz_code'=>'TL-O02','type'=>'Traffic Light Orange','area'=>'Calarian',    'latitude'=>6.93650,'longitude'=>122.03780,'confidence'=>88.6,'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-11 15:50:00'],
            ['haz_code'=>'TL-O03','type'=>'Traffic Light Orange','area'=>'San Roque',   'latitude'=>6.94180,'longitude'=>122.06100,'confidence'=>90.4,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-12 10:40:00'],
            ['haz_code'=>'TL-O04','type'=>'Traffic Light Orange','area'=>'Sta Maria',   'latitude'=>6.92570,'longitude'=>122.07340,'confidence'=>89.2,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-13 13:00:00'],
            ['haz_code'=>'TL-O05','type'=>'Traffic Light Orange','area'=>'Tugbungan',   'latitude'=>6.91980,'longitude'=>122.08600,'confidence'=>91.1,'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-14 08:20:00'],
            ['haz_code'=>'TL-O06','type'=>'Traffic Light Orange','area'=>'Talon-Talon', 'latitude'=>6.91360,'longitude'=>122.10700,'confidence'=>88.9,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-15 12:00:00'],
            ['haz_code'=>'TL-O07','type'=>'Traffic Light Orange','area'=>'Pasonanca',   'latitude'=>6.95700,'longitude'=>122.07900,'confidence'=>90.7,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-16 08:45:00'],
            ['haz_code'=>'TL-O08','type'=>'Traffic Light Orange','area'=>'Lunzuran',    'latitude'=>6.95950,'longitude'=>122.09300,'confidence'=>89.5,'rider_code'=>'RIDER-016','status'=>'active','detected_at'=>'2026-06-16 17:00:00'],
            ['haz_code'=>'TL-O09','type'=>'Traffic Light Orange','area'=>'Baliwasan',   'latitude'=>6.91900,'longitude'=>122.06120,'confidence'=>90.9,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-17 10:20:00'],
            ['haz_code'=>'TL-O10','type'=>'Traffic Light Orange','area'=>'City Proper', 'latitude'=>6.90820,'longitude'=>122.07650,'confidence'=>88.3,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-17 14:35:00'],

            // ── Traffic Light Green ────────────────────────────────────────
            ['haz_code'=>'TL-G01','type'=>'Traffic Light Green','area'=>'City Proper', 'latitude'=>6.90490,'longitude'=>122.07120,'confidence'=>90.2,'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-11 10:30:00'],
            ['haz_code'=>'TL-G02','type'=>'Traffic Light Green','area'=>'San Roque',   'latitude'=>6.94300,'longitude'=>122.06750,'confidence'=>91.6,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-11 16:15:00'],
            ['haz_code'=>'TL-G03','type'=>'Traffic Light Green','area'=>'Calarian',    'latitude'=>6.93820,'longitude'=>122.04200,'confidence'=>89.4,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-12 11:00:00'],
            ['haz_code'=>'TL-G04','type'=>'Traffic Light Green','area'=>'Sta Maria',   'latitude'=>6.92660,'longitude'=>122.07010,'confidence'=>90.8,'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-12 15:30:00'],
            ['haz_code'=>'TL-G05','type'=>'Traffic Light Green','area'=>'Tugbungan',   'latitude'=>6.92090,'longitude'=>122.08010,'confidence'=>88.7,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-13 09:30:00'],
            ['haz_code'=>'TL-G06','type'=>'Traffic Light Green','area'=>'Pasonanca',   'latitude'=>6.96140,'longitude'=>122.07680,'confidence'=>92.0,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-14 12:45:00'],
            ['haz_code'=>'TL-G07','type'=>'Traffic Light Green','area'=>'Talon-Talon', 'latitude'=>6.91140,'longitude'=>122.09870,'confidence'=>89.1,'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-15 09:20:00'],
            ['haz_code'=>'TL-G08','type'=>'Traffic Light Green','area'=>'Lunzuran',    'latitude'=>6.96070,'longitude'=>122.09810,'confidence'=>91.3,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-15 16:10:00'],
            ['haz_code'=>'TL-G09','type'=>'Traffic Light Green','area'=>'Baliwasan',   'latitude'=>6.91750,'longitude'=>122.06540,'confidence'=>90.5,'rider_code'=>'rider_maria','status'=>'active','detected_at'=>'2026-06-16 10:00:00'],
            ['haz_code'=>'TL-G10','type'=>'Traffic Light Green','area'=>'Tumaga',      'latitude'=>6.94640,'longitude'=>122.09050,'confidence'=>89.9,'rider_code'=>'rider_pedro','status'=>'active','detected_at'=>'2026-06-17 07:30:00'],
            ['haz_code'=>'TL-G11','type'=>'Traffic Light Green','area'=>'City Proper', 'latitude'=>6.90750,'longitude'=>122.07440,'confidence'=>92.4,'rider_code'=>'rider_juan','status'=>'active','detected_at'=>'2026-06-17 13:00:00'],
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
